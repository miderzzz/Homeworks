import { useCallback, useEffect, useMemo, useState } from 'react';
import { Queue } from '../DataStructures/Queue';
import {
  cancelOrder,
  expireUnpaidOrders,
  fetchActiveOrders,
  fetchPaymentWindow,
  subscribeToOrders,
  updateOrderStatus,
} from '../Services/orderService';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [windowHours, setWindowHours] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      await expireUnpaidOrders();
      const [active, settings] = await Promise.all([fetchActiveOrders(), fetchPaymentWindow()]);
      setOrders(active);
      setWindowHours(settings.payment_window_hours);
      setError('');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    let unsubscribe = () => null;
    try {
      unsubscribe = subscribeToOrders(() => load());
    } catch {
      unsubscribe = () => null;
    }
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [load]);

  const queues = useMemo(() => {
    const toVerify = Queue.fromArray(orders.filter((order) => order.status === 'pendiente_pago'));
    const toShip = Queue.fromArray(orders.filter((order) => order.status === 'pagado'));
    return {
      toVerify: toVerify.toArray(),
      nextToVerify: toVerify.peek() ?? null,
      toShip: toShip.toArray(),
      nextToShip: toShip.peek() ?? null,
    };
  }, [orders]);

  const minutesLeft = (order) =>
    Math.max(0, Math.ceil((new Date(order.created_at).getTime() + windowHours * 3600000 - now) / 60000));

  const run = async (order, task) => {
    setBusyId(order.id);
    setError('');
    try {
      await task();
      await load();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusyId(null);
    }
  };

  return {
    ...queues,
    loading,
    error,
    busyId,
    minutesLeft,
    confirmPayment: (order) => run(order, () => updateOrderStatus(order.id, 'pagado')),
    markShipped: (order) => run(order, () => updateOrderStatus(order.id, 'enviado')),
    cancel: (order) => run(order, () => cancelOrder(order.id)),
  };
};
