import { useMemo, useState } from 'react';
import { useCatalog } from './useCatalog';
import { SEARCH_LIMIT } from '../Helpers/constants';

export const useSearch = (limit = SEARCH_LIMIT) => {
  const { searchEngine } = useCatalog();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchEngine.searchTopK(query, limit), [searchEngine, query, limit]);

  return { query, setQuery, results, clear: () => setQuery('') };
};
