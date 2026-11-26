import { Queue } from './Queue';

export class Graph {
  constructor() {
    this.adjacency = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacency.has(vertex)) this.adjacency.set(vertex, new Map());
    return this;
  }

  addEdge(a, b, weight = 1) {
    if (a === b) return this;
    this.addVertex(a);
    this.addVertex(b);
    const total = (this.adjacency.get(a).get(b) ?? 0) + weight;
    this.adjacency.get(a).set(b, total);
    this.adjacency.get(b).set(a, total);
    return this;
  }

  hasVertex(vertex) {
    return this.adjacency.has(vertex);
  }

  weight(a, b) {
    return this.adjacency.get(a)?.get(b) ?? 0;
  }

  neighbors(vertex) {
    return [...(this.adjacency.get(vertex) ?? new Map()).entries()].map(([to, weight]) => ({ vertex: to, weight }));
  }

  bfs(start, maxDepth = Infinity) {
    if (!this.hasVertex(start)) return [];
    const visited = new Set([start]);
    const queue = Queue.fromArray([{ vertex: start, depth: 0 }]);
    const result = [];

    while (!queue.isEmpty()) {
      const { vertex, depth } = queue.dequeue();
      if (depth >= maxDepth) continue;
      for (const { vertex: next } of this.neighbors(vertex)) {
        if (visited.has(next)) continue;
        visited.add(next);
        result.push({ vertex: next, depth: depth + 1, via: vertex });
        queue.enqueue({ vertex: next, depth: depth + 1 });
      }
    }

    return result;
  }

  size() {
    return this.adjacency.size;
  }
}
