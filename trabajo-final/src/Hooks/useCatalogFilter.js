import { useMemo } from 'react';
import { useCatalog } from './useCatalog';

export const useCatalogFilter = ({ league, team, version }) => {
  const { activeProducts, tree } = useCatalog();

  return useMemo(() => {
    const products = activeProducts.filter(
      (product) =>
        (!league || product.league_slug === league) &&
        (!team || product.team_slug === team) &&
        (!version || product.kit_type === version),
    );

    const path = ['/catalogo', league, team, version].filter(Boolean).join('/');
    const breadcrumb = tree.pathTo((node) => node.path === path);

    return { products, breadcrumb };
  }, [activeProducts, tree, league, team, version]);
};
