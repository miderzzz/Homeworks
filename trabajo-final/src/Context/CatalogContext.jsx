import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts } from '../Services/catalogService';
import { buildCatalogTree } from '../Helpers/catalogTree';
import { SearchEngine } from '../DataStructures/SearchEngine';
import { useAuth } from '../Hooks/useAuth';

export const CatalogContext = createContext(null);

export const CatalogProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState({ categories: [], products: [], loading: true, error: "" });

  const reload = useCallback(async () => {
    try {
      const categories = await fetchCategories();
      const products = await fetchProducts(categories);
      setState({ categories, products, loading: false, error: "" });
    } catch (error) {
      setState((previous) => ({ ...previous, loading: false, error: error.message }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload, userId]);

  const value = useMemo(() => {
    const activeProducts = state.products.filter((product) => product.is_active);

    return {
      ...state,
      activeProducts,
      leagues: state.categories.filter((category) => category.level === "liga"),
      teams: state.categories.filter((category) => category.level === "equipo"),
      tree: buildCatalogTree(state.categories, activeProducts),
      searchEngine: new SearchEngine(activeProducts),
      reload,
    };
  }, [state, reload]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};
