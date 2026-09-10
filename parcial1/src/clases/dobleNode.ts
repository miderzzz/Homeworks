export class DoubleNode<T> {
    value: T;
    next: DoubleNode<T> | null;
    prev: DoubleNode<T> | null;
    constructor(value: T) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }}