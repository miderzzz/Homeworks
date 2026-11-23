import { Queue } from './Queue';

export class TreeNode {
  constructor(id, label, path, data = null) {
    this.id = id;
    this.label = label;
    this.path = path;
    this.data = data;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
    return node;
  }

  isLeaf() {
    return this.children.length === 0;
  }
}

export class NaryTree {
  constructor(root = null) {
    this.root = root;
  }

  dfs(predicate, node = this.root) {
    if (!node) return null;
    if (predicate(node)) return node;
    for (const child of node.children) {
      const found = this.dfs(predicate, child);
      if (found) return found;
    }
    return null;
  }

  bfs(visit) {
    if (!this.root) return;
    const queue = Queue.fromArray([this.root]);
    while (!queue.isEmpty()) {
      const node = queue.dequeue();
      visit(node);
      node.children.forEach((child) => queue.enqueue(child));
    }
  }

  find(id) {
    return this.dfs((node) => node.id === id);
  }

  findByPath(path) {
    return this.dfs((node) => node.path === path);
  }

  pathTo(predicate, node = this.root, trail = []) {
    if (!node) return [];
    const current = [...trail, node];
    if (predicate(node)) return current;
    for (const child of node.children) {
      const found = this.pathTo(predicate, child, current);
      if (found.length) return found;
    }
    return [];
  }

  size() {
    let count = 0;
    this.bfs(() => {
      count += 1;
    });
    return count;
  }
}
