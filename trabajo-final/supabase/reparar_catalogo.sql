alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "catalogo publico categorias" on public.categories;
create policy "catalogo publico categorias" on public.categories
  for select to anon, authenticated using (true);
drop policy if exists "admin gestiona categorias" on public.categories;
create policy "admin gestiona categorias" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catalogo publico productos" on public.products;
create policy "catalogo publico productos" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "admin gestiona productos" on public.products;
create policy "admin gestiona productos" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catalogo publico imagenes" on public.product_images;
create policy "catalogo publico imagenes" on public.product_images
  for select to anon, authenticated using (true);
drop policy if exists "admin gestiona imagenes" on public.product_images;
create policy "admin gestiona imagenes" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catalogo publico tallas" on public.product_variants;
create policy "catalogo publico tallas" on public.product_variants
  for select to anon, authenticated using (true);
drop policy if exists "admin gestiona tallas" on public.product_variants;
create policy "admin gestiona tallas" on public.product_variants
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "llave breb publica" on public.store_settings;
create policy "llave breb publica" on public.store_settings
  for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_images,
  public.product_variants, public.store_settings to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into public.categories (name, slug, level, sort_order) values
  ('LaLiga', '', 'liga', 1), ('Premier League', '', 'liga', 2), ('Serie A', '', 'liga', 3),
  ('Bundesliga', '', 'liga', 4), ('Ligue 1', '', 'liga', 5), ('Liga BetPlay', '', 'liga', 6),
  ('Brasileirão', '', 'liga', 7), ('Liga Profesional Argentina', '', 'liga', 8),
  ('Resto del mundo', '', 'liga', 9)
on conflict do nothing;

insert into public.categories (name, slug, level, parent_id, sort_order)
select t.name, '', 'equipo', c.id, t.ord
  from (values
    ('laliga', 'Real Madrid', 1), ('laliga', 'FC Barcelona', 2), ('laliga', 'Atlético de Madrid', 3),
    ('premier-league', 'Manchester City', 1), ('premier-league', 'Liverpool', 2), ('premier-league', 'Arsenal', 3),
    ('serie-a', 'Juventus', 1), ('serie-a', 'AC Milan', 2), ('serie-a', 'Inter de Milán', 3),
    ('bundesliga', 'Bayern Múnich', 1), ('bundesliga', 'Borussia Dortmund', 2),
    ('ligue-1', 'Paris Saint-Germain', 1), ('ligue-1', 'Olympique de Marsella', 2),
    ('liga-betplay', 'América de Cali', 1), ('liga-betplay', 'Deportivo Cali', 2),
    ('liga-betplay', 'Atlético Nacional', 3), ('liga-betplay', 'Millonarios', 4),
    ('brasileirao', 'Flamengo', 1), ('brasileirao', 'Palmeiras', 2),
    ('liga-profesional-argentina', 'Boca Juniors', 1), ('liga-profesional-argentina', 'River Plate', 2)
  ) as t(liga_slug, name, ord)
  join public.categories c on c.slug = t.liga_slug and c.level = 'liga'
on conflict do nothing;

select
  (select count(*) from public.categories where level = 'liga')   as ligas,
  (select count(*) from public.categories where level = 'equipo') as equipos,
  (select count(*) from pg_policies where tablename = 'categories') as reglas_categorias,
  (select role from public.profiles p join auth.users u on u.id = p.id
    where u.email = 'amiderosespana@gmail.com')                   as tu_rol;
