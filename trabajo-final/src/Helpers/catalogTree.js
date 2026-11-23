import { NaryTree, TreeNode } from '../DataStructures/NaryTree';
import { toTitleCase } from './formatters';
import { KIT_TYPES } from './constants';

const byOrder = (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name);

export const buildCatalogTree = (categories, products) => {
  const root = new TreeNode('root', 'Ligas', '/catalogo');
  const leagues = categories.filter((c) => c.level === 'liga').sort(byOrder);

  leagues.forEach((league) => {
    const leagueNode = new TreeNode(
      `liga-${league.id}`,
      toTitleCase(league.name),
      `/catalogo/${league.slug}`,
      league,
    );

    categories
      .filter((c) => c.level === 'equipo' && c.parent_id === league.id)
      .sort(byOrder)
      .forEach((team) => {
        const teamProducts = products.filter((p) => p.category_id === team.id);
        if (teamProducts.length === 0) return;

        const teamNode = leagueNode.addChild(
          new TreeNode(`equipo-${team.id}`, toTitleCase(team.name), `${leagueNode.path}/${team.slug}`, team),
        );

        KIT_TYPES.filter((kit) => teamProducts.some((p) => p.kit_type === kit.value)).forEach((kit) => {
          teamNode.addChild(new TreeNode(`${teamNode.id}-${kit.value}`, kit.label, `${teamNode.path}/${kit.value}`, kit));
        });
      });

    if (!leagueNode.isLeaf()) root.addChild(leagueNode);
  });

  return new NaryTree(root);
};
