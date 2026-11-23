import { useMemo, useState } from 'react';
import { useCatalog } from './useCatalog';
import { useAdmin } from './useAdmin';
import { adjustStock } from '../Services/inventoryService';
import { toTitleCase } from '../Helpers/formatters';

export const useInventory = () => {
  const { products, loading, error, reload } = useCatalog();
  const { lastAction, pendingUndos, pushAction, popAction } = useAdmin();
  const [overrides, setOverrides] = useState({});
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(null);
  const [actionError, setActionError] = useState('');

  const stockOf = (variant) => overrides[variant.id] ?? variant.stock;

  const apply = async (variant, delta, why) => {
    const stock = await adjustStock(variant.id, delta, why);
    setOverrides((current) => ({ ...current, [variant.id]: stock }));
  };

  const run = async (key, task) => {
    setBusy(key);
    setActionError('');
    try {
      await task();
      reload();
    } catch (failure) {
      setActionError(failure.message);
    } finally {
      setBusy(null);
    }
  };

  const change = (product, variant, delta) => {
    if (!delta) return Promise.resolve();
    return run(variant.id, async () => {
      await apply(variant, delta, 'Ajuste de inventario');
      pushAction({
        variant,
        delta,
        label: `${toTitleCase(product.team)} · ${product.name} · Talla ${variant.size}`,
      });
    });
  };

  const setExact = (product, variant, value) => {
    const target = Math.max(0, Math.floor(Number(value) || 0));
    return change(product, variant, target - stockOf(variant));
  };

  const undo = () =>
    run('undo', async () => {
      if (!lastAction) return;
      await apply(lastAction.variant, -lastAction.delta, 'Deshacer');
      popAction();
    });

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return products;
    return products.filter((product) => `${product.team} ${product.league} ${product.name}`.toLowerCase().includes(text));
  }, [products, query]);

  return {
    products: filtered,
    loading,
    error: error || actionError,
    query,
    setQuery,
    busy,
    stockOf,
    change,
    setExact,
    undo,
    lastAction,
    pendingUndos,
  };
};
