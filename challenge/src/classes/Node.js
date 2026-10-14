export class Node {
    constructor(value) {
            this.value = value
            this.children = []
        }

        addChild(node){
            this.children.push(node)
        }

        isLeaf() {
            return this.children.length === 0
        }
    }
