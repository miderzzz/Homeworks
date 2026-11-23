export class Stack {
  constructor(limit = Infinity) {
    this.items = [];
    this.limit = limit;
  }

  static fromArray(values = [], limit = Infinity) {
    const stack = new Stack(limit);
    values.forEach((value) => stack.push(value));
    return stack;
  }

  push(value) {
    this.items.push(value);
    if (this.items.length > this.limit) this.items.shift();
    return this;
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items.at(-1);
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  toArray() {
    return [...this.items];
  }
}
