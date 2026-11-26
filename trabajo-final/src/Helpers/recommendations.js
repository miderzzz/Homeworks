import { Graph } from '../DataStructures/Graph';
import { SearchEngine } from '../DataStructures/SearchEngine';

export const RECOMMENDATION_LIMIT = 4;

const RELATIONS = [
  { weight: 4, same: (a, b) => a.team_slug === b.team_slug },
  { weight: 2, same: (a, b) => a.league_slug === b.league_slug },
  { weight: 1, same: (a, b) => a.kit_type === b.kit_type },
  { weight: 1, same: (a, b) => a.kit_format === b.kit_format },
];

const SECOND_LEVEL_FACTOR = 0.25;

export const buildProductGraph = (products) => {
  const graph = new Graph();
  products.forEach((product) => graph.addVertex(product.id));

  for (let i = 0; i < products.length; i += 1) {
    for (let j = i + 1; j < products.length; j += 1) {
      const weight = RELATIONS.reduce(
        (total, relation) => total + (relation.same(products[i], products[j]) ? relation.weight : 0),
        0,
      );
      if (weight > 0) graph.addEdge(products[i].id, products[j].id, weight);
    }
  }

  return graph;
};

const inStock = (product) => product.variants.some((variant) => variant.stock > 0);

export const recommend = (graph, productsById, productId, limit = RECOMMENDATION_LIMIT) => {
  const candidates = graph
    .bfs(productId, 2)
    .map(({ vertex, depth, via }) => ({
      product: productsById.get(vertex),
      score: depth === 1 ? graph.weight(productId, vertex) : graph.weight(via, vertex) * SECOND_LEVEL_FACTOR,
    }))
    .filter(({ product }) => product && inStock(product));

  return SearchEngine.topK(candidates, limit, (item) => item.score * 1e6 + (item.product.sales_count ?? 0)).map(
    (item) => item.product,
  );
};
