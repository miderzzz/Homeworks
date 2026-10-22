import './App.css';
import { booksData } from "./data/librosData"
import { Form } from './components/form';
import { BotonDelete } from './components/botonDelete';
import { BookStack } from './components/libroStack';
import { Stack } from './class/Stack';
import { useState } from "react"

const createInitialStack = () => {
  const stack = new Stack();
  booksData.forEach((book) => stack.push(book));
  return stack;
};

function App() {
  const [stack] = useState(createInitialStack);
  const [books, setBooks] = useState(() => stack.toarray());

  const addBookStack = (newBook) => {
    stack.push(newBook);
    setBooks(stack.toarray());
  }

  const deleteBookStack = () => {
    stack.pop();
    setBooks(stack.toarray());
  }

  return (
    <div className="App">
      <h1>BIBLIOTECA UAO</h1>

      <div className="stack">
        <BookStack books={books} />
      </div>

      <Form onAddBook={addBookStack} />

      <BotonDelete
        deleteLastBook={deleteBookStack}
        text="Borrar libro"
        typeBoton="delete" />
    </div>
  );
}

export default App;