import { useMemo, useState } from 'react';
import { EMPTY_FILTERS, applyFilters, countActiveFilters, priceBounds } from '../Helpers/productFilters';
import { onlyDigits } from '../Helpers/formatters';

export const useProductFilters = (products) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [open, setOpen] = useState(false);

  const toggle = (key, value) =>
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));

  const setField = (key, value) =>
    setFilters((current) => ({
      ...current,
      [key]: key === 'minPrice' || key === 'maxPrice' ? onlyDigits(value) : value,
    }));

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const bounds = useMemo(() => priceBounds(products), [products]);

  return {
    filters,
    results,
    bounds,
    activeCount: countActiveFilters(filters),
    open,
    toggleOpen: () => setOpen((current) => !current),
    toggle,
    setField,
    reset: () => setFilters((current) => ({ ...EMPTY_FILTERS, sort: current.sort })),
  };
};
