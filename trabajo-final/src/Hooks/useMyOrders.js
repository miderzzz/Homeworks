import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { fetchMyOrders } from '../Services/orderService';

export const useMyOrders = () => {
  const { user } = useAuth();
  const [state, setState] = useState({ orders: [], loading: true, error: '' });

  useEffect(() => {
    if (!user) return undefined;
    let active = true;

    fetchMyOrders(user.id)
      .then((orders) => active && setState({ orders, loading: false, error: '' }))
      .catch((error) => active && setState({ orders: [], loading: false, error: error.message }));

    return () => {
      active = false;
    };
  }, [user]);

  return state;
};
