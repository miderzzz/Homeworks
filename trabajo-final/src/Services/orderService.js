import { getClient, unwrap } from '../Helpers/supabaseClient';

export const createOrder = async ({ lines, customer, address, discountCode }) =>
  unwrap(
    await getClient().rpc('create_order', {
      items: lines,
      customer,
      address,
      p_discount_code: discountCode || null,
    }),
  );

export const fetchMyOrders = async (userId) =>
  unwrap(
    await getClient()
      .from('orders')
      .select('*, order_items(id, quantity, unit_price, product_variants(size, products(name)))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  );

export const notifyOrder = async (orderCode) =>
  getClient().functions.invoke('notify-order', { body: { order_code: orderCode } });

export const fetchActiveOrders = async () =>
  unwrap(
    await getClient()
      .from('orders')
      .select('*, order_items(id, quantity, unit_price, product_variants(size, products(name)))')
      .in('status', ['pendiente_pago', 'pagado'])
      .order('created_at', { ascending: true }),
  );

export const updateOrderStatus = async (orderId, status) =>
  unwrap(await getClient().from('orders').update({ status }).eq('id', orderId));

export const cancelOrder = async (orderId) =>
  unwrap(await getClient().rpc('cancel_order', { p_order_id: orderId }));

export const expireUnpaidOrders = async () => unwrap(await getClient().rpc('expire_unpaid_orders'));

export const fetchPaymentWindow = async () =>
  unwrap(await getClient().from('store_settings').select('payment_window_hours, whatsapp').eq('id', 1).single());

export const subscribeToOrders = (onChange) => {
  const channel = getClient()
    .channel('admin-orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange)
    .subscribe();
  return () => getClient().removeChannel(channel);
};
