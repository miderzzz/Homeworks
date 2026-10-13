import { Node } from "./Node";

export class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) return;
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  preOrder(node = this.root, result = []) {
    if (node === null) return result;
    result.push(node.value);
    this.preOrder(node.left, result);
    this.preOrder(node.right, result);
    return result;
  }

  inOrder(node = this.root, result = []) {
    if (node === null) return result;
    this.inOrder(node.left, result);
    result.push(node.value);
    this.inOrder(node.right, result);
    return result;
  }

  postOrder(node = this.root, result = []) {
    if (node === null) return result;
    this.postOrder(node.left, result);
    this.postOrder(node.right, result);
    result.push(node.value);
    return result;
  }

  contains(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }

    return false;
  }
}
