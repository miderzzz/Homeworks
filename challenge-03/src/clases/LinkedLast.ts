import { Node } from './Node';

export class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  peek(value: T, current = this.head): Node<T> | null {
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  size(): number {
    return this.length;
  }

  remove(value: T) {
    if (!this.head) return null;

    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      this.length--;
      return;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) {
        this.tail = current;
      }
      this.length--;
    }
  }

print(formatter?: (value: T) => string): string {
  let current = this.head;
  let result = '';
  while (current) {
    const text = formatter ? formatter(current.value) : String(current.value);
    result += text + ' -> ';
    current = current.next;
  }
  return result + 'null';
}
}