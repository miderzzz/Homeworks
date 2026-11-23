import { Trie } from "./Trie.js";
import { MinHeap } from "./MinHeap.js";

export class SearchEngine {
  constructor(products = []) {
    this.trie = new Trie();
    this.products = products;
    products.forEach((product) => this.insert(product));
  }

  static topK(items, k, key = (item) => item.sales_count) {
    const heap = new MinHeap([], key);
    for (const item of items) {
      heap.push(item);
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

  insert(product) {
    this.trie.insertWords(product.name, product);
    this.trie.insertWords(product.team, product);
  }

  searchTopK(prefix, k) {
    const text = prefix.trim();
    if (!text) return [];
    return SearchEngine.topK(this.trie.searchByPrefix(text), k);
  }

  topSellers(k) {
    return SearchEngine.topK(this.products, k);
  }
}
