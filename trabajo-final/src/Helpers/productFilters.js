import { SearchEngine } from '../DataStructures/SearchEngine';

export const SORT_OPTIONS = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'vendidos', label: 'Más vendidos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
];

export const EMPTY_FILTERS = {
  sizes: [],
  kitTypes: [],
  sleeves: [],
  formats: [],
  minPrice: '',
  maxPrice: '',
  onlyAvailable: false,
  sort: 'recientes',
};

const LIST_KEYS = ['sizes', 'kitTypes', 'sleeves', 'formats'];

export const countActiveFilters = (filters) =>
  LIST_KEYS.reduce((total, key) => total + filters[key].length, 0) +
  (filters.minPrice !== '' ? 1 : 0) +
  (filters.maxPrice !== '' ? 1 : 0) +
  (filters.onlyAvailable ? 1 : 0);

const matchesList = (selected, value) => selected.length === 0 || selected.includes(value);

const hasStock = (product, sizes) =>
  product.variants.some((variant) => variant.stock > 0 && (sizes.length === 0 || sizes.includes(variant.size)));

const SORTERS = {
  vendidos: (items) => SearchEngine.sortBy(items, (item) => item.sales_count ?? 0, true),
  'precio-asc': (items) => SearchEngine.sortBy(items, (item) => Number(item.price)),
  'precio-desc': (items) => SearchEngine.sortBy(items, (item) => Number(item.price), true),
};

export const applyFilters = (products, filters) => {
  const min = filters.minPrice === '' ? 0 : Number(filters.minPrice);
  const max = filters.maxPrice === '' ? Infinity : Number(filters.maxPrice);
  const needsStock = filters.onlyAvailable || filters.sizes.length > 0;

  const filtered = products.filter(
    (product) =>
      matchesList(filters.kitTypes, product.kit_type) &&
      matchesList(filters.sleeves, product.sleeve_type) &&
      matchesList(filters.formats, product.kit_format) &&
      Number(product.price) >= min &&
      Number(product.price) <= max &&
      (!needsStock || hasStock(product, filters.sizes)),
  );

  const sorter = SORTERS[filters.sort];
  return sorter ? sorter(filtered) : filtered;
};

export const priceBounds = (products) => {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((product) => Number(product.price));
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
