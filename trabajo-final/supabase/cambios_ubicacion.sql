update public.store_settings
set store_lat = 3.4484950070242215,
    store_lng = -76.52987301349415,
    store_address = 'Centro Comercial El Caleño, Local 527, Cali'
where id = 1;

select store_name, store_address, store_lat, store_lng from public.store_settings where id = 1;
