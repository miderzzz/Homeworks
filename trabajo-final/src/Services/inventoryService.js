import { getClient, unwrap } from '../Helpers/supabaseClient';

export const adjustStock = async (variantId, delta, reason) => {
  try {
    return unwrap(
      await getClient().rpc('adjust_stock', { p_variant_id: variantId, p_delta: delta, p_reason: reason }),
    );
  } catch (error) {
    if (error.message.includes('stock_check')) {
      throw new Error('No puedes dejar una talla con existencias negativas');
    }
    throw error;
  }
};
