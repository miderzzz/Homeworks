import { MinHeap } from './classes/MinHeap.js';
import { SearchEngine } from './classes/SearchEngine.js';

const heap = new MinHeap([5, 3, 8, 1, 9, 2]);
console.log('heapify:', heap.toArray());
console.log('peek:', heap.peek());
const ordered = [];
while (heap.size() > 0) ordered.push(heap.pop());
console.log('pops:', ordered);

const engine = new SearchEngine();
engine.insert('air max', 90);
engine.insert('air force', 95);
engine.insert('air jordan', 85);
engine.insert('adidas boost', 80);

console.log('search("air max"):', engine.trie.search('air max'));
console.log('search("air"):', engine.trie.search('air'));
console.log('searchTopK("air", 2):', engine.searchTopK('air', 2));
console.log('searchTopK("a", 10):', engine.searchTopK('a', 10));
console.log('searchTopK("nike", 3):', engine.searchTopK('nike', 3));