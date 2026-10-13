import { numbers } from "./data/numbers";
import { BinaryTree } from "./classes/BinaryTree";
import "./App.css";
import Tree from "react-d3-tree";

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const toD3 = (Node) => {
  if (Node === null) return null;
  const children = [toD3(Node.left), toD3(Node.right)].filter(Boolean);
  return { name: String(Node.value), children };
};

const tree = new BinaryTree();
numbers.forEach((n) => tree.insert(n));
console.log(tree.root);
console.log("PreOrder: ", tree.preOrder());
console.log("InOrder: ", tree.inOrder());
console.log("PostOrder: ", tree.postOrder());

const numberRandom = randomNumber(1, 350);
console.log(
  "Is there number",
  numberRandom,
  "?: ",
  tree.contains(numberRandom),
);

const treeData = toD3(tree.root);

function App() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <h1
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          margin: 0,
          zIndex: 1,
        }}
      >
        BINARY TREE
      </h1>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="straight"
        translate={{ x: window.innerWidth / 2, y: 80 }}
        zoom={0.9}
        transitionDuration={0}
      />
      <p
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          margin: 0,
          zIndex: 1,
          fontSize: 33
        }}
      >
        Is there number {numberRandom}?{" "}
        {tree.contains(numberRandom) ? "Yes" : "No"}
      </p>
    </div>
  );
}

export default App;
