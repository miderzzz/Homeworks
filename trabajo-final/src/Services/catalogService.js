import { getClient, unwrap } from '../Helpers/supabaseClient';
import { SIZES } from '../Helpers/constants';

const sortImages = (images = []) =>
  [...images].sort((a, b) => Number(b.is_main) - Number(a.is_main) || a.sort_order - b.sort_order);

const sortVariants = (variants = []) =>
  [...variants].sort((a, b) => SIZES.indexOf(a.size) - SIZES.indexOf(b.size));

const normalizeProduct = (row, categoriesById) => {
  const { product_images: rawImages, product_variants: rawVariants, ...fields } = row;
  const team = categoriesById.get(fields.category_id);
  const league = team ? categoriesById.get(team.parent_id) : null;
  const images = sortImages(rawImages);

  return {
    ...fields,
    team: team?.name ?? '',
    team_slug: team?.slug ?? '',
    league: league?.name ?? '',
    league_slug: league?.slug ?? '',
    league_id: league?.id ?? null,
    images,
    image_url: images[0]?.url ?? null,
    variants: sortVariants(rawVariants),
  };
};

export const fetchCategories = async () =>
  unwrap(await getClient().from('categories').select('*').order('sort_order'));

export const fetchProducts = async (categories) => {
  const rows = unwrap(
    await getClient()
      .from('products')
      .select('*, product_images(*), product_variants(*)')
      .order('created_at', { ascending: false }),
  );
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  return rows.map((row) => normalizeProduct(row, categoriesById));
};
