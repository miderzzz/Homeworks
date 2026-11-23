alter table public.store_settings add column if not exists whatsapp text not null default '';
alter table public.store_settings add column if not exists notify_email text not null default '';
alter table public.store_settings drop constraint if exists store_settings_whatsapp_check;
alter table public.store_settings add constraint store_settings_whatsapp_check
  check (whatsapp = '' or whatsapp ~ '^57[0-9]{10}$');
alter table public.store_settings drop constraint if exists store_settings_notify_email_check;
alter table public.store_settings add constraint store_settings_notify_email_check
  check (notify_email = '' or notify_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
alter table public.store_settings alter column payment_window_hours set default 1;

alter table public.orders add column if not exists notified_at timestamptz;
alter table public.orders drop constraint if exists orders_order_code_check;
alter table public.orders add constraint orders_order_code_check
  check (order_code ~ '^[A-Z]{3}-[A-Z0-9]{6}$');

update public.store_settings
   set breb_key = '@SportChampion',
       breb_key_type = 'alfanumerica',
       breb_holder = 'Sport Champion Carlos Mideros',
       payment_window_hours = 1,
       store_name = 'Sport Champion',
       store_address = 'Centro Comercial El Caleño, Local 527, Cali',
       whatsapp = '573175190835',
       notify_email = 'amiderosespana@gmail.com'
 where id = 1;

create or replace function public.generate_order_code()
returns text
language plpgsql
as $$
declare
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code  text;
begin
  loop
    v_code := 'CSC-';
    for i in 1..6 loop
      v_code := v_code || substr(v_chars, 1 + floor(random() * length(v_chars))::int, 1);
    end loop;
    exit when not exists (select 1 from public.orders where order_code = v_code);
  end loop;
  return v_code;
end;
$$;

create or replace function public._expire_overdue()
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_hours int;
  v_id    bigint;
  v_count int := 0;
begin
  select coalesce(payment_window_hours, 1) into v_hours from public.store_settings where id = 1;

  for v_id in
    select id from public.orders
     where status = 'pendiente_pago'
       and created_at < now() - make_interval(hours => coalesce(v_hours, 1))
     for update skip locked
  loop
    update public.orders set status = 'cancelado' where id = v_id;
    perform public._restock_order(v_id);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

create or replace function public.create_order(items jsonb, customer jsonb, address text, p_discount_code text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_order_id  bigint;
  v_code      text;
  v_total     numeric(12, 0) := 0;
  v_item      jsonb;
  v_variant   record;
  v_qty       int;
  v_settings  public.store_settings;
  v_discount  jsonb;
  v_amount    numeric(12, 0) := 0;
begin
  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
    raise exception 'El carrito está vacío';
  end if;
  if jsonb_array_length(items) > 20 then
    raise exception 'Máximo 20 productos distintos por pedido';
  end if;

  perform public._expire_overdue();

  select * into v_settings from public.store_settings where id = 1;
  if not found then
    raise exception 'La tienda aún no tiene llave Bre-B configurada';
  end if;

  v_code := public.generate_order_code();

  insert into public.orders (order_code, user_id, customer_name, customer_email,
                             customer_phone, shipping_address, total)
  values (v_code,
          auth.uid(),
          trim(customer ->> 'name'),
          lower(trim(customer ->> 'email')),
          regexp_replace(coalesce(customer ->> 'phone', ''), '\D', '', 'g'),
          trim(address),
          0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(items) loop
    v_qty := (v_item ->> 'quantity')::int;

    select pv.id, pv.stock, pv.size, pv.product_id, p.price, p.is_active, p.name
      into v_variant
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
     where pv.id = (v_item ->> 'variant_id')::bigint
     for update of pv;

    if not found or not v_variant.is_active then
      raise exception 'Producto no disponible (variante %)', v_item ->> 'variant_id';
    end if;
    if v_variant.stock < v_qty then
      raise exception 'Stock insuficiente para % talla %: quedan %',
        v_variant.name, v_variant.size, v_variant.stock;
    end if;

    update public.product_variants set stock = stock - v_qty where id = v_variant.id;
    update public.products set sales_count = sales_count + v_qty where id = v_variant.product_id;

    insert into public.order_items (order_id, variant_id, quantity, unit_price)
    values (v_order_id, v_variant.id, v_qty, v_variant.price);

    v_total := v_total + v_variant.price * v_qty;
  end loop;

  if p_discount_code is not null and trim(p_discount_code) <> '' then
    v_discount := public._discount_for(p_discount_code, v_total, true);
    v_amount := (v_discount ->> 'amount')::numeric;
    update public.discount_codes
       set used_count = used_count + 1
     where code = v_discount ->> 'code';
  end if;

  update public.orders
     set subtotal        = v_total,
         discount_code   = v_discount ->> 'code',
         discount_amount = v_amount,
         total           = v_total - v_amount
   where id = v_order_id;

  return jsonb_build_object(
    'order_id',        v_order_id,
    'order_code',      v_code,
    'subtotal',        v_total,
    'discount_code',   v_discount ->> 'code',
    'discount_amount', v_amount,
    'total',           v_total - v_amount,
    'status',     'pendiente_pago',
    'expires_at', now() + make_interval(hours => v_settings.payment_window_hours),
    'payment_window_hours', v_settings.payment_window_hours,
    'whatsapp', v_settings.whatsapp,
    'breb', jsonb_build_object(
      'key',      v_settings.breb_key,
      'key_type', v_settings.breb_key_type,
      'holder',   v_settings.breb_holder
    )
  );
end;
$$;

create or replace function public.get_order_by_code(p_code text, p_email text)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_order    public.orders;
  v_settings public.store_settings;
begin
  select * into v_order
    from public.orders
   where order_code = upper(trim(p_code))
     and customer_email = lower(trim(p_email));

  if not found then
    raise exception 'No encontramos un pedido con ese código y correo';
  end if;

  select * into v_settings from public.store_settings where id = 1;

  return jsonb_build_object(
    'order_code',       v_order.order_code,
    'status',           v_order.status,
    'subtotal',         v_order.subtotal,
    'discount_code',    v_order.discount_code,
    'discount_amount',  v_order.discount_amount,
    'total',            v_order.total,
    'customer_name',    v_order.customer_name,
    'shipping_address', v_order.shipping_address,
    'created_at',       v_order.created_at,
    'expires_at',       v_order.created_at + make_interval(hours => coalesce(v_settings.payment_window_hours, 1)),
    'whatsapp',         v_settings.whatsapp,
    'breb', jsonb_build_object(
      'key',      v_settings.breb_key,
      'key_type', v_settings.breb_key_type,
      'holder',   v_settings.breb_holder
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
               'product',    p.name,
               'team',       c.name,
               'size',       pv.size,
               'quantity',   oi.quantity,
               'unit_price', oi.unit_price) order by oi.id)
        from public.order_items oi
        join public.product_variants pv on pv.id = oi.variant_id
        join public.products p          on p.id  = pv.product_id
        join public.categories c        on c.id  = p.category_id
       where oi.order_id = v_order.id
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.expire_unpaid_orders()
returns int
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    raise exception 'Solo el administrador puede expirar pedidos';
  end if;
  return public._expire_overdue();
end;
$$;

revoke execute on function public._expire_overdue() from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.schedule('expirar-pedidos', '* * * * *', $$ select public.expire_unpaid_orders(); $$);

select breb_key, breb_holder, payment_window_hours, whatsapp, notify_email from public.store_settings;
