import {Node} from './node';
export class LinkedList<T> {
    head: Node<T> | null = null;
    tail: Node<T> | null = null;
    lenght = 0;
    
    append(value: T) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        }else{
            this.tail!.next = newNode;
            this.tail = newNode;
        } 
        this.lenght++;

    }

    removeFirst(): T | null {
        if (!this.head) return null;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head) this.tail = null;
        this.lenght--;
        return value;
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
        return arreglo;
    }
}