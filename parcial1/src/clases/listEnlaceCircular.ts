import {CircularNode} from "./nodeCircular";

export class CircularLinkedList<T> {
    head: CircularNode<T> | null = null;
    tail: CircularNode<T> | null = null;
    length: number = 0;

    append(value: T) {
        const newNode = new CircularNode(value);
        if(!this.head) {
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
        }else{
            this.tail!.next = newNode;
            newNode.next = this.head;
            this.tail = newNode;
        }
        this.length++;
    }

    size(): number {
        return this.length;
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