import { useMemo } from 'react';
import { useCatalog } from './useCatalog';
import { toTitleCase } from '../Helpers/formatters';
import { leagueLogo } from '../Helpers/leagueLogos';

export const useLeagueTiles = () => {
  const { leagues } = useCatalog();

  return useMemo(
    () =>
      [...leagues]
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
        .map((league) => ({
          id: league.id,
          name: toTitleCase(league.name),
          path: `/catalogo/${league.slug}`,
          logo: leagueLogo(league.slug),
        })),
    [leagues],
  );
};
