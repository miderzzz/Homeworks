import { useMemo } from 'react';
import { useCatalog } from './useCatalog';
import { TOP_SELLERS_LIMIT } from '../Helpers/constants';

export const useTopSellers = (limit = TOP_SELLERS_LIMIT) => {
  const { searchEngine } = useCatalog();
  return useMemo(() => searchEngine.topSellers(limit), [searchEngine, limit]);
};
