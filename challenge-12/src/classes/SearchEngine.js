import { Trie } from './Trie.js';
import { MinHeap } from './MinHeap.js';

export class SearchEngine {
  constructor() {
    this.trie = new Trie();
  }

  insert(name, popularity) {
    this.trie.insert(name, popularity);
  }

  searchTopK(prefix, k) {
    const products = this.trie.searchByPrefix(prefix);
    const heap = new MinHeap([], product => product.popularity);

    for (const product of products) {
      heap.push(product);
      if (heap.size() > k) {
        heap.pop();
      }
    }

    const result = [];
    while (heap.size() > 0) {
      result.push(heap.pop());
    }
    return result.reverse();
  }
}