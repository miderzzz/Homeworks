class Node {
  constructor(value) {
    this.value = value;
    this.isEndOfWord = false;
    this.children = {};
    this.items = [];
  }
}

export class Trie {
  constructor() {
    this.root = new Node(null);
  }

  insert(text, item) {
    let current = this.root;
    for (const character of text.toLowerCase()) {
      if (current.children[character] === undefined) {
        current.children[character] = new Node(character);
      }
      current = current.children[character];
    }
    current.isEndOfWord = true;
    current.items.push(item);
  }

  insertWords(text, item) {
    const words = text.trim().split(/\s+/);
    words.forEach((_, index) => this.insert(words.slice(index).join(' '), item));
  }

  search(word) {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  findNode(prefix) {
    let current = this.root;
    for (const character of prefix.toLowerCase()) {
      if (current.children[character] === undefined) {
        return null;
      }
      current = current.children[character];
    }
    return current;
  }

  collect(node, results = []) {
    if (node.isEndOfWord) {
      results.push(...node.items);
    }
    for (const character in node.children) {
      this.collect(node.children[character], results);
    }
    return results;
  }

  searchByPrefix(prefix) {
    const node = this.findNode(prefix);
    if (!node) return [];
    const unique = new Map();
    for (const item of this.collect(node)) {
      unique.set(item.id, item);
    }
    return [...unique.values()];
  }
}
