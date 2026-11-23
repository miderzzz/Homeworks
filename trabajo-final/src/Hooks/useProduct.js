import { useMemo, useState } from 'react';
import { useCatalog } from './useCatalog';
import { useCart } from './useCart';

export const useProduct = (id) => {
  const { activeProducts, loading } = useCatalog();
  const { items, addItem } = useCart();
  const [sizeId, setSizeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = useMemo(() => activeProducts.find((item) => String(item.id) === String(id)), [activeProducts, id]);
  const variant = product?.variants.find((item) => item.id === sizeId) ?? null;
  const inCart = items.find((item) => item.variantId === sizeId)?.quantity ?? 0;
  const available = variant ? Math.max(variant.stock - inCart, 0) : 0;
  const soldOut = product ? product.variants.every((item) => item.stock === 0) : false;

  const selectSize = (variantId) => {
    setSizeId(variantId);
    setQuantity(1);
    setAdded(false);
  };

  const add = () => {
    if (!variant || available === 0) return;
    addItem(product, variant, quantity);
    setAdded(true);
  };

  return {
    product,
    loading,
    variant,
    quantity,
    setQuantity: (value) => setQuantity(Math.max(1, Math.min(Number(value) || 1, available || 1))),
    available,
    soldOut,
    added,
    selectSize,
    add,
  };
};
