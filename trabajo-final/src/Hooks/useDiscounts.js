import { useCallback, useEffect, useState } from 'react';
import { createDiscount, deleteDiscount, fetchDiscounts, updateDiscount } from '../Services/discountService';

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setDiscounts(await fetchDiscounts());
      setError('');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action) => {
    try {
      await action();
      await load();
    } catch (failure) {
      setError(failure.message);
    }
  };

  return {
    discounts,
    loading,
    error,
    create: async (discount) => {
      await createDiscount(discount);
      await load();
    },
    toggle: (discount) => run(() => updateDiscount(discount.id, { is_active: !discount.is_active })),
    remove: (discount) => run(() => deleteDiscount(discount.id)),
  };
};
