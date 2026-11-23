import { getClient, unwrap } from '../Helpers/supabaseClient';

const BUCKET = 'uniformes';

const getOrCreateTeam = async (teamName, leagueId) =>
  unwrap(await getClient().rpc('get_or_create_team', { p_name: teamName, p_liga_id: leagueId || null }));

const uploadImage = async (productId, file, index) => {
  const client = getClient();
  const extension = file.name.split('.').pop().toLowerCase();
  const path = `productos/${productId}/${Date.now()}-${index}.${extension}`;
  unwrap(await client.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false }));
  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
};

const saveVariants = async (productId, variants) => {
  const rows = Object.entries(variants)
    .filter(([, variant]) => variant.enabled || variant.id)
    .map(([size, variant]) => ({
      product_id: productId,
      size,
      stock: variant.enabled ? Number(variant.stock) : 0,
    }));
  if (rows.length === 0) return;
  unwrap(await getClient().from('product_variants').upsert(rows, { onConflict: 'product_id,size' }));
};

const saveImages = async (productId, images, previousImages) => {
  const client = getClient();
  const rows = [];

  for (const [index, image] of images.entries()) {
    if (image.kind === 'file') {
      rows.push(await uploadImage(productId, image.file, index));
    } else {
      rows.push({ url: image.url, path: image.path ?? null });
    }
  }

  const keptPaths = new Set(rows.map((row) => row.path).filter(Boolean));
  const removedPaths = previousImages.map((image) => image.path).filter((path) => path && !keptPaths.has(path));

  unwrap(await client.from('product_images').delete().eq('product_id', productId));
  unwrap(
    await client.from('product_images').insert(
      rows.map((row, index) => ({ ...row, product_id: productId, is_main: index === 0, sort_order: index })),
    ),
  );

  if (removedPaths.length) {
    await client.storage.from(BUCKET).remove(removedPaths);
  }
};

export const saveProduct = async ({ id, form, leagueId, variants, images, previousImages = [] }) => {
  const client = getClient();
  const teamId = await getOrCreateTeam(form.teamName, leagueId);

  const fields = {
    name: form.name.trim(),
    description: form.description.trim(),
    category_id: teamId,
    kit_type: form.kit_type,
    sleeve_type: form.sleeve_type,
    kit_format: form.kit_format,
    season: form.season.trim(),
    price: Number(form.price),
    is_active: form.is_active,
  };

  const saved = id
    ? unwrap(await client.from('products').update(fields).eq('id', id).select('id').single())
    : unwrap(await client.from('products').insert(fields).select('id').single());

  await saveVariants(saved.id, variants);
  await saveImages(saved.id, images, previousImages);
  return saved.id;
};

export const setProductActive = async (id, isActive) =>
  unwrap(await getClient().from('products').update({ is_active: isActive }).eq('id', id));
