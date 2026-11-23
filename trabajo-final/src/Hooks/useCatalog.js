import { useContext } from 'react';
import { CatalogContext } from '../Context/CatalogContext';

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return context;
};
