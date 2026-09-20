import './App.css';
import { booksData } from "./data/librosData"
import { Form } from './components/form';
import { BotonDelete } from './components/botonDelete';
import { BookStack } from './components/libroStack';
import { useState } from "react"


function App() {

  const [stack, setStack] = useState(booksData);

  const addBookStack = (newBook) => {
    setStack([...stack, newBook]);
  }

  const deleteBookStack = () => {
    setStack(stack.slice(0, -1));
  }
return (


  <div className="App">
  
    <h1>BIBLIOTECA UAO</h1>
  
    <div className="stack">
    <BookStack books={stack}/>
    </div>


    <Form onAddBook={addBookStack}/>

    <BotonDelete
      deleteLastBook={deleteBookStack}
      text= "Borrar libro"
      typeBoton="delete"/>




  </div>)
    ;
}

export default App;
