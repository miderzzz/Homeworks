import { createContext, useEffect, useMemo, useState } from 'react';
import { Queue } from '../DataStructures/Queue';
import { CART_STORAGE_KEY, MAX_QUANTITY } from '../Helpers/constants';
import { calcDiscount } from '../Helpers/pricing';
import { validateDiscount } from '../Services/discountService';

export const CartContext = createContext(null);

const loadItems = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const clamp = (value, max) => Math.max(1, Math.min(value, max, MAX_QUANTITY));

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadItems);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
  }, [items]);

  const value = useMemo(() => {
    const withQueue = (operation) =>
      setItems((current) => {
        const queue = Queue.fromArray(current);
        operation(queue);
        return queue.toArray();
      });

    const sameVariant = (variantId) => (item) => item.variantId === variantId;

    const addItem = (product, variant, quantity) =>
      withQueue((queue) => {
        if (queue.find(sameVariant(variant.id))) {
          queue.update(sameVariant(variant.id), (item) => ({
            ...item,
            maxStock: variant.stock,
            quantity: clamp(item.quantity + quantity, variant.stock),
          }));
        } else {
          queue.enqueue({
            variantId: variant.id,
            productId: product.id,
            name: product.name,
            team: product.team,
            size: variant.size,
            price: product.price,
            image: product.image_url,
            maxStock: variant.stock,
            quantity: clamp(quantity, variant.stock),
          });
        }
      });

    const updateQuantity = (variantId, quantity) =>
      withQueue((queue) =>
        queue.update(sameVariant(variantId), (item) => ({ ...item, quantity: clamp(quantity, item.maxStock) })),
      );

    const removeItem = (variantId) => withQueue((queue) => queue.remove(sameVariant(variantId)));

    const toOrderLines = () => {
      const queue = Queue.fromArray(items);
      const lines = [];
      while (!queue.isEmpty()) {
        const item = queue.dequeue();
        lines.push({ variant_id: item.variantId, quantity: item.quantity });
      }
      return lines;
    };

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = calcDiscount(discount, subtotal);

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      discountAmount,
      total: subtotal - discountAmount,
      addItem,
      updateQuantity,
      removeItem,
      toOrderLines,
      applyDiscount: async (code) => setDiscount(await validateDiscount(code.trim().toUpperCase(), subtotal)),
      removeDiscount: () => setDiscount(null),
      clearCart: () => {
        setItems([]);
        setDiscount(null);
      },
    };
  }, [items, discount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
