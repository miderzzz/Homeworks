import { useMemo } from 'react';
import { useCatalog } from './useCatalog';
import { recommend } from '../Helpers/recommendations';

export const useRecommendations = (productId) => {
  const { productGraph, productsById } = useCatalog();

  return useMemo(
    () => (productId && productGraph ? recommend(productGraph, productsById, productId) : []),
    [productGraph, productsById, productId],
  );
};
