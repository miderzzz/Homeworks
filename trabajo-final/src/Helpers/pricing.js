export const calcDiscount = (discount, subtotal) => {
  if (!discount || subtotal < discount.min_purchase) return 0;
  if (discount.discount_type === 'porcentaje') return Math.round((subtotal * discount.value) / 100);
  return Math.min(discount.value, subtotal);
};
