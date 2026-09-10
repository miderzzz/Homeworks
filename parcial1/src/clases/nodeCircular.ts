export class CircularNode<T> {
    value: T;
    next: CircularNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.next = null;
    }
}