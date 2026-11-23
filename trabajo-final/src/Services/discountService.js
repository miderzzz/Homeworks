import { getClient, unwrap } from '../Helpers/supabaseClient';

const friendlyError = (error) => {
  if (error.message.includes('duplicate key')) return new Error('Ya existe un código con ese nombre');
  return error;
};

export const validateDiscount = async (code, subtotal) =>
  unwrap(await getClient().rpc('validate_discount', { p_code: code, p_subtotal: subtotal }));

export const fetchDiscounts = async () =>
  unwrap(await getClient().from('discount_codes').select('*').order('created_at', { ascending: false }));

export const createDiscount = async (discount) => {
  try {
    return unwrap(await getClient().from('discount_codes').insert(discount).select().single());
  } catch (error) {
    throw friendlyError(error);
  }
};

export const updateDiscount = async (id, changes) =>
  unwrap(await getClient().from('discount_codes').update(changes).eq('id', id));

export const deleteDiscount = async (id) =>
  unwrap(await getClient().from('discount_codes').delete().eq('id', id));
