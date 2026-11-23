class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static fromArray(values = []) {
    const queue = new Queue();
    values.forEach((value) => queue.enqueue(value));
    return queue;
  }

  enqueue(value) {
    const node = new Node(value);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this.length += 1;
    return this;
  }

  dequeue() {
    if (!this.head) return undefined;
    const { value } = this.head;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length -= 1;
    return value;
  }

  peek() {
    return this.head ? this.head.value : undefined;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  find(predicate) {
    let current = this.head;
    while (current) {
      if (predicate(current.value)) return current.value;
      current = current.next;
    }
    return undefined;
  }

  update(predicate, updater) {
    let current = this.head;
    while (current) {
      if (predicate(current.value)) current.value = updater(current.value);
      current = current.next;
    }
    return this;
  }

  remove(predicate) {
    const kept = new Queue();
    while (!this.isEmpty()) {
      const value = this.dequeue();
      if (!predicate(value)) kept.enqueue(value);
    }
    this.head = kept.head;
    this.tail = kept.tail;
    this.length = kept.length;
    return this;
  }

  toArray() {
    const values = [];
    let current = this.head;
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }
}
