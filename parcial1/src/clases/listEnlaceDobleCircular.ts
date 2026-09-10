import {DoubleNode} from './dobleNode';
export class CircularDoubleLinkedList<T> {
    head: DoubleNode<T> | null = null;
    tail: DoubleNode<T> | null = null;
    lenght = 0;

    append(value: T) {
        const newNode = new DoubleNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
            newNode.prev = this.tail;
        }else{
            newNode.prev = this.tail;
            newNode.next = this.head;
            this.tail!.next = newNode;
            this.head.prev = newNode;
            this.tail = newNode;
        }
        this.lenght++}

    size(): number {
        return this.lenght;
    }
    toArray(): T[] {
        if (!this.head) return [];
        const arreglo: T[] = [];
        let nodoActual = this.head;
        do{
            arreglo.push(nodoActual.value);
            nodoActual = nodoActual.next!;
        } while (nodoActual !== this.head);
        return arreglo;
    }

}