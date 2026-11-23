import { useState } from 'react';
import { useCatalog } from './useCatalog';
import { setProductActive } from '../Services/productService';

export const useAdminProducts = () => {
  const { products, loading, error, reload } = useCatalog();
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState('');

  const toggleActive = async (product) => {
    setBusyId(product.id);
    setActionError('');
    try {
      await setProductActive(product.id, !product.is_active);
      await reload();
    } catch (failure) {
      setActionError(failure.message);
    } finally {
      setBusyId(null);
    }
  };

  return { products, loading, error: error || actionError, busyId, toggleActive };
};
