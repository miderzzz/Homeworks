import {DoubleNode} from './dobleNode';
export class DoubleLinkedList<T> {
    head: DoubleNode<T> | null = null;
    tail: DoubleNode<T> | null = null;
    lenght = 0;

    append(value: T) {
        const newNode = new DoubleNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        }else{
            this.tail!.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.lenght++;

    }
    size(): number {
        return this.lenght;
    }
    toArray(): T[] {
        const arreglo: T[] = [];
        let nodoActual = this.head;
        while (nodoActual) {
            arreglo.push(nodoActual.value);
            nodoActual = nodoActual.next;
        }
        return arreglo}}