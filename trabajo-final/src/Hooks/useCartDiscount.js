import { useState } from 'react';
import { useCart } from './useCart';

export const useCartDiscount = () => {
  const { applyDiscount, removeDiscount, discount, discountAmount, subtotal } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const apply = async (event) => {
    event.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setError('');
    try {
      await applyDiscount(code);
      setCode('');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setChecking(false);
    }
  };

  const remove = () => {
    removeDiscount();
    setError('');
  };

  const belowMinimum = Boolean(discount) && subtotal < discount.min_purchase;

  return { code, setCode, error, checking, apply, remove, discount, discountAmount, belowMinimum };
};
