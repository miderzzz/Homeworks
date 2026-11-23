create or replace function public.normalize_name(p_text text)
returns text
language sql immutable
as $$
  select upper(regexp_replace(trim(coalesce(p_text, '')), '\s+', ' ', 'g'));
$$;

create or replace function public.slugify(p_text text)
returns text
language sql immutable
as $$
  select trim(both '-' from
           regexp_replace(
             translate(lower(coalesce(p_text, '')),
                       'áàâãäéèêëíìîïóòôõöúùûüñç', 'aaaaaeeeeiiiiooooouuuunc'),
             '[^a-z0-9]+', '-', 'g'));
$$;

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  phone       text not null default '',
  role        text not null default 'cliente'
              check (role in ('cliente', 'admin')),
  created_at  timestamptz not null default now()
);

create table public.categories (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 2 and 60),
  slug        text not null,
  level       text not null check (level in ('liga', 'equipo')),
  parent_id   bigint references public.categories(id) on delete restrict,
  sort_order  int not null default 0,
  unique (level, name),
  unique (level, slug),
  constraint categories_parent_ok check (
    (level = 'liga'   and parent_id is null) or
    (level = 'equipo' and parent_id is not null)
  )
);

create table public.products (
  id            bigint generated always as identity primary key,
  name          text not null check (char_length(name) between 3 and 80),
  description   text not null default '',
  category_id   bigint not null references public.categories(id) on delete restrict,
  kit_type      text not null default 'local'
                check (kit_type in ('local', 'visitante', 'alterno', 'arquero')),
  sleeve_type   text not null default 'corta'
                check (sleeve_type in ('corta', 'larga')),
  kit_format    text not null default 'camiseta'
                check (kit_format in ('camiseta', 'completo')),
  season        text not null default '',
  price         numeric(12, 0) not null check (price > 0),
  sales_count   int not null default 0 check (sales_count >= 0),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table public.product_images (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  url         text not null,
  path        text,
  is_main     boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create unique index product_images_one_main
  on public.product_images (product_id) where is_main;

create table public.product_variants (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  size        text not null check (size in ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  stock       int not null default 0 check (stock >= 0),
  unique (product_id, size)
);

create table public.orders (
  id                bigint generated always as identity primary key,
  order_code        text not null unique,
  user_id           uuid references public.profiles(id) on delete set null,
  customer_name     text not null check (char_length(trim(customer_name)) between 3 and 80),
  customer_email    text not null check (customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  customer_phone    text not null check (customer_phone ~ '^[0-9]{8,15}$'),
  shipping_address  text not null check (char_length(trim(shipping_address)) >= 10),
  status            text not null default 'pendiente_pago'
                    check (status in ('pendiente_pago', 'pagado', 'enviado', 'entregado', 'cancelado')),
  subtotal          numeric(12, 0) not null default 0 check (subtotal >= 0),
  discount_code     text,
  discount_amount   numeric(12, 0) not null default 0 check (discount_amount >= 0),
  total             numeric(12, 0) not null check (total >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  notified_at       timestamptz,
  notify_error      text,
  constraint orders_discount_ok check (discount_amount <= subtotal),
  constraint orders_order_code_check check (order_code ~ '^[A-Z]{3}-[A-Z0-9]{6}$')
);

create table public.order_items (
  id          bigint generated always as identity primary key,
  order_id    bigint not null references public.orders(id) on delete cascade,
  variant_id  bigint not null references public.product_variants(id) on delete restrict,
  quantity    int not null check (quantity between 1 and 10),
  unit_price  numeric(12, 0) not null check (unit_price > 0)
);

create table public.inventory_log (
  id          bigint generated always as identity primary key,
  variant_id  bigint not null references public.product_variants(id) on delete cascade,
  admin_id    uuid references public.profiles(id) on delete set null,
  delta       int not null check (delta <> 0),
  reason      text not null default 'ajuste',
  created_at  timestamptz not null default now()
);

create table public.store_settings (
  id                    int primary key default 1 check (id = 1),
  breb_key              text not null,
  breb_key_type         text not null
                        check (breb_key_type in ('celular', 'documento', 'correo', 'alfanumerica', 'comercio')),
  breb_holder           text not null,
  payment_window_hours  int not null default 1 check (payment_window_hours between 1 and 168),
  store_name            text not null default 'Tienda de Uniformes',
  store_address         text not null default '',
  store_lat             double precision not null check (store_lat between -4.3 and 13.5),
  store_lng             double precision not null check (store_lng between -82 and -66),
  whatsapp              text not null default '' check (whatsapp = '' or whatsapp ~ '^57[0-9]{10}$'),
  notify_email          text not null default '' check (notify_email = '' or notify_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  updated_at            timestamptz not null default now(),
  constraint breb_key_format check (
       (breb_key_type = 'celular'      and breb_key ~ '^3[0-9]{9}$')
    or (breb_key_type = 'documento'    and breb_key ~ '^[0-9A-Za-z]{5,15}$')
    or (breb_key_type = 'correo'       and breb_key ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
    or (breb_key_type = 'alfanumerica' and breb_key ~ '^@[0-9A-Za-z]{3,20}$')
    or (breb_key_type = 'comercio'     and breb_key ~ '^[0-9A-Za-z]{3,20}$')
  )
);

create table public.discount_codes (
  id             bigint generated always as identity primary key,
  code           text not null unique check (code ~ '^[A-Z0-9_-]{3,20}$'),
  discount_type  text not null check (discount_type in ('porcentaje', 'valor')),
  value          numeric(12, 0) not null check (value > 0),
  min_purchase   numeric(12, 0) not null default 0 check (min_purchase >= 0),
  max_uses       int check (max_uses is null or max_uses > 0),
  used_count     int not null default 0 check (used_count >= 0),
  starts_at      timestamptz not null default now(),
  expires_at     timestamptz,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  constraint discount_percent_ok check (discount_type <> 'porcentaje' or value <= 90),
  constraint discount_dates_ok check (expires_at is null or expires_at > starts_at)
);

create index on public.categories (parent_id);
create index on public.products (category_id);
create index on public.products (kit_type);
create index on public.product_images (product_id);
create index on public.product_variants (product_id);
create index on public.orders (status, created_at);
create index on public.orders (user_id);
create index on public.order_items (order_id);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          coalesce(new.raw_user_meta_data ->> 'full_name', ''),
          coalesce(new.raw_user_meta_data ->> 'phone', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.prevent_role_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'No tienes permiso para cambiar el rol';
  end if;
  return new;
end;
$$;

create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.prevent_role_change();

create or replace function public.normalize_category()
returns trigger
language plpgsql
as $$
begin
  new.name := public.normalize_name(new.name);
  new.slug := public.slugify(new.name);
  if new.level = 'equipo' and not exists (
       select 1 from public.categories where id = new.parent_id and level = 'liga') then
    raise exception 'Un equipo debe pertenecer a una liga existente';
  end if;
  return new;
end;
$$;

create trigger categories_normalize
  before insert or update of name, level, parent_id on public.categories
  for each row execute function public.normalize_category();

create or replace function public.check_product_category()
returns trigger
language plpgsql
as $$
begin
  if not exists (select 1 from public.categories
                  where id = new.category_id and level = 'equipo') then
    raise exception 'El uniforme debe pertenecer a un equipo';
  end if;
  return new;
end;
$$;

create trigger products_category_guard
  before insert or update of category_id on public.products
  for each row execute function public.check_product_category();

create or replace function public.check_image_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.product_images where product_id = new.product_id) >= 5 then
    raise exception 'Máximo 5 imágenes por uniforme';
  end if;
  return new;
end;
$$;

create trigger product_images_limit
  before insert on public.product_images
  for each row execute function public.check_image_limit();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_touch
  before update on public.orders
  for each row execute function public.touch_updated_at();

create trigger settings_touch
  before update on public.store_settings
  for each row execute function public.touch_updated_at();

create or replace function public.normalize_discount_code()
returns trigger language plpgsql as $$
begin
  new.code := upper(trim(new.code));
  return new;
end;
$$;

create trigger discount_codes_normalize
  before insert or update of code on public.discount_codes
  for each row execute function public.normalize_discount_code();

create or replace function public._discount_for(p_code text, p_subtotal numeric, p_lock boolean)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  d        public.discount_codes;
  v_amount numeric(12, 0);
begin
  if p_lock then
    select * into d from public.discount_codes where code = upper(trim(p_code)) for update;
  else
    select * into d from public.discount_codes where code = upper(trim(p_code));
  end if;

  if not found or not d.is_active then
    raise exception 'El código de descuento no existe o no está activo';
  end if;
  if now() < d.starts_at then
    raise exception 'El código de descuento aún no está vigente';
  end if;
  if d.expires_at is not null and now() > d.expires_at then
    raise exception 'El código de descuento ya venció';
  end if;
  if d.max_uses is not null and d.used_count >= d.max_uses then
    raise exception 'El código de descuento ya alcanzó su límite de usos';
  end if;
  if p_subtotal < d.min_purchase then
    raise exception 'Este código requiere una compra mínima de $%', d.min_purchase;
  end if;

  v_amount := case
    when d.discount_type = 'porcentaje' then round(p_subtotal * d.value / 100)
    else least(d.value, p_subtotal)
  end;

  return jsonb_build_object(
    'code',          d.code,
    'discount_type', d.discount_type,
    'value',         d.value,
    'min_purchase',  d.min_purchase,
    'amount',        v_amount
  );
end;
$$;

create or replace function public.check_status_transition()
returns trigger language plpgsql as $$
begin
  if new.status = old.status then
    return new;
  end if;
  if not (
       (old.status = 'pendiente_pago' and new.status in ('pagado', 'cancelado'))
    or (old.status = 'pagado'         and new.status in ('enviado', 'cancelado'))
    or (old.status = 'enviado'        and new.status = 'entregado')
  ) then
    raise exception 'Transición de estado no permitida: % → %', old.status, new.status;
  end if;
  return new;
end;
$$;

create trigger orders_status_guard
  before update of status on public.orders
  for each row execute function public.check_status_transition();

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

create or replace function public._restock_order(p_order_id bigint)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.product_variants pv
     set stock = pv.stock + oi.quantity
    from public.order_items oi
   where oi.order_id = p_order_id and pv.id = oi.variant_id;

  update public.products p
     set sales_count = greatest(p.sales_count - sub.qty, 0)
    from (
      select pv.product_id, sum(oi.quantity) as qty
        from public.order_items oi
        join public.product_variants pv on pv.id = oi.variant_id
       where oi.order_id = p_order_id
       group by pv.product_id
    ) sub
   where p.id = sub.product_id;

  update public.discount_codes
     set used_count = greatest(used_count - 1, 0)
   where code = (select discount_code from public.orders where id = p_order_id);
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

create or replace function public.validate_discount(p_code text, p_subtotal numeric)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select public._discount_for(p_code, p_subtotal, false);
$$;

create or replace function public.get_or_create_team(p_name text, p_liga_id bigint)
returns bigint
language plpgsql security definer set search_path = public
as $$
declare
  v_name    text := public.normalize_name(p_name);
  v_team_id bigint;
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede crear equipos';
  end if;
  if char_length(v_name) < 2 then
    raise exception 'El nombre del equipo es muy corto';
  end if;

  select id into v_team_id
    from public.categories
   where level = 'equipo' and name = v_name;

  if found then
    return v_team_id;
  end if;

  if p_liga_id is null or not exists (
       select 1 from public.categories where id = p_liga_id and level = 'liga') then
    raise exception 'El equipo % no existe: elige una liga para crearlo', v_name;
  end if;

  insert into public.categories (name, slug, level, parent_id)
  values (v_name, public.slugify(v_name), 'equipo', p_liga_id)
  returning id into v_team_id;

  return v_team_id;
end;
$$;

create or replace function public.adjust_stock(p_variant_id bigint, p_delta int, p_reason text default 'ajuste')
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_new_stock int;
begin
  if not public.is_admin() then
    raise exception 'Solo el administrador puede modificar existencias';
  end if;

  update public.product_variants
     set stock = stock + p_delta
   where id = p_variant_id
  returning stock into v_new_stock;

  if not found then
    raise exception 'Variante % no existe', p_variant_id;
  end if;

  insert into public.inventory_log (variant_id, admin_id, delta, reason)
  values (p_variant_id, auth.uid(), p_delta, p_reason);

  return v_new_stock;
end;
$$;

create or replace function public.cancel_order(p_order_id bigint)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_order public.orders;
begin
  select * into v_order from public.orders where id = p_order_id for update;

  if not found then
    raise exception 'Pedido no encontrado';
  end if;
  if not public.is_admin() and (v_order.user_id is null or v_order.user_id <> auth.uid()) then
    raise exception 'No puedes cancelar este pedido';
  end if;

  update public.orders set status = 'cancelado' where id = p_order_id;
  perform public._restock_order(p_order_id);
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

revoke execute on function public._restock_order(bigint)                  from public, anon, authenticated;
revoke execute on function public._expire_overdue()                       from public, anon, authenticated;
revoke execute on function public.create_order(jsonb, jsonb, text, text)  from public;
revoke execute on function public._discount_for(text, numeric, boolean)    from public, anon, authenticated;
revoke execute on function public.validate_discount(text, numeric)        from public;
revoke execute on function public.get_order_by_code(text, text)           from public;
revoke execute on function public.get_or_create_team(text, bigint)        from public, anon;
revoke execute on function public.adjust_stock(bigint, int, text)         from public, anon;
revoke execute on function public.cancel_order(bigint)                    from public, anon;
revoke execute on function public.expire_unpaid_orders()                  from public, anon;

grant execute on function public.create_order(jsonb, jsonb, text, text)  to anon, authenticated;
grant execute on function public.validate_discount(text, numeric)        to anon, authenticated;
grant execute on function public.get_order_by_code(text, text)     to anon, authenticated;
grant execute on function public.get_or_create_team(text, bigint)  to authenticated;
grant execute on function public.adjust_stock(bigint, int, text)   to authenticated;
grant execute on function public.cancel_order(bigint)              to authenticated;
grant execute on function public.expire_unpaid_orders()            to authenticated;

grant usage on schema public to anon, authenticated;

grant select on public.categories, public.products, public.product_images,
  public.product_variants, public.store_settings to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

alter table public.profiles          enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.product_images    enable row level security;
alter table public.product_variants  enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.inventory_log     enable row level security;
alter table public.store_settings    enable row level security;
alter table public.discount_codes    enable row level security;

create policy "ver mi perfil o admin ve todos" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());
create policy "editar mi perfil" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "catalogo publico categorias" on public.categories
  for select to anon, authenticated using (true);
create policy "admin gestiona categorias" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "catalogo publico productos" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "admin gestiona productos" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "catalogo publico imagenes" on public.product_images
  for select to anon, authenticated using (true);
create policy "admin gestiona imagenes" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "catalogo publico tallas" on public.product_variants
  for select to anon, authenticated using (true);
create policy "admin gestiona tallas" on public.product_variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "ver mis pedidos o admin" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());
create policy "admin cambia estado" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "ver mis items o admin" on public.order_items
  for select to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = (select auth.uid())
    )
  );

create policy "admin lee inventario" on public.inventory_log
  for select to authenticated using (public.is_admin());

create policy "llave breb publica" on public.store_settings
  for select to anon, authenticated using (true);
create policy "admin edita ajustes" on public.store_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin gestiona descuentos" on public.discount_codes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uniformes', 'uniformes', true, 2097152,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "fotos uniformes publicas" on storage.objects
  for select to anon, authenticated using (bucket_id = 'uniformes');
create policy "admin sube fotos" on storage.objects
  for insert to authenticated with check (bucket_id = 'uniformes' and public.is_admin());
create policy "admin reemplaza fotos" on storage.objects
  for update to authenticated using (bucket_id = 'uniformes' and public.is_admin());
create policy "admin borra fotos" on storage.objects
  for delete to authenticated using (bucket_id = 'uniformes' and public.is_admin());

alter publication supabase_realtime add table public.product_variants;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.store_settings;

insert into public.store_settings (id, breb_key, breb_key_type, breb_holder, payment_window_hours,
                                   store_name, store_address, store_lat, store_lng,
                                   whatsapp, notify_email)
values (1, '@SportChampion', 'alfanumerica', 'Sport Champion Carlos Mideros', 1,
        'Sport Champion', 'Centro Comercial El Caleño, Local 527, Cali', 3.4484950070242215, -76.52987301349415,
        '573175190835', 'amiderosespana@gmail.com');

insert into public.categories (name, slug, level, sort_order) values
  ('LaLiga',                     '', 'liga', 1),
  ('Premier League',             '', 'liga', 2),
  ('Serie A',                    '', 'liga', 3),
  ('Bundesliga',                 '', 'liga', 4),
  ('Ligue 1',                    '', 'liga', 5),
  ('Liga BetPlay',               '', 'liga', 6),
  ('Brasileirão',                '', 'liga', 7),
  ('Liga Profesional Argentina', '', 'liga', 8),
  ('Resto del mundo',            '', 'liga', 9);

insert into public.categories (name, slug, level, parent_id, sort_order)
select t.name, '', 'equipo', c.id, t.ord
  from (values
    ('laliga',                     'Real Madrid',            1),
    ('laliga',                     'FC Barcelona',           2),
    ('laliga',                     'Atlético de Madrid',     3),
    ('premier-league',             'Manchester City',        1),
    ('premier-league',             'Liverpool',              2),
    ('premier-league',             'Arsenal',                3),
    ('serie-a',                    'Juventus',               1),
    ('serie-a',                    'AC Milan',               2),
    ('serie-a',                    'Inter de Milán',         3),
    ('bundesliga',                 'Bayern Múnich',          1),
    ('bundesliga',                 'Borussia Dortmund',      2),
    ('ligue-1',                    'Paris Saint-Germain',    1),
    ('ligue-1',                    'Olympique de Marsella',  2),
    ('liga-betplay',               'América de Cali',        1),
    ('liga-betplay',               'Deportivo Cali',         2),
    ('liga-betplay',               'Atlético Nacional',      3),
    ('liga-betplay',               'Millonarios',            4),
    ('brasileirao',                'Flamengo',               1),
    ('brasileirao',                'Palmeiras',              2),
    ('liga-profesional-argentina', 'Boca Juniors',           1),
    ('liga-profesional-argentina', 'River Plate',            2)
  ) as t(liga_slug, name, ord)
  join public.categories c on c.slug = t.liga_slug and c.level = 'liga';
