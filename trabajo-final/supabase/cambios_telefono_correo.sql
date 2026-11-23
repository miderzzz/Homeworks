alter table public.orders add column if not exists notify_error text;

alter table public.orders drop constraint if exists orders_customer_phone_check;

update public.orders
   set customer_phone = '57' || customer_phone
 where customer_phone ~ '^3[0-9]{9}$';

alter table public.orders add constraint orders_customer_phone_check
  check (customer_phone ~ '^[0-9]{8,15}$');

update public.profiles
   set phone = '57' || phone
 where phone ~ '^3[0-9]{9}$';

select order_code, customer_phone, notified_at, notify_error
  from public.orders
 order by created_at desc
 limit 5;
