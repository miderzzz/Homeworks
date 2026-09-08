import { DoublyNode } from './DoublyNode';

export class DoublyLinkedList<T> {
  head: DoublyNode<T> | null;
  tail: DoublyNode<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T) {
    const newNode = new DoublyNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length++;
  }

  peek(value: T, current = this.head): DoublyNode<T> | null {
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
    let current = this.head;

    while (current) {
      if (current.value === value) {
        if (current === this.head) {
          this.head = current.next;
          if (this.head) this.head.prev = null;
        }

        if (current === this.tail) {
          this.tail = current.prev;
          if (this.tail) this.tail.next = null;
        }

        if (current.prev) current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;

        this.length--;
        return current;
      }
      current = current.next;
    }

    return null;
  }

  print(formatter?: (value: T) => string): string {
  let current = this.head;
  let result = '';
  while (current) {
    const text = formatter ? formatter(current.value) : String(current.value);
    result += text + ' <-> ';
    current = current.next;
  }
  return result + 'null';
}
}