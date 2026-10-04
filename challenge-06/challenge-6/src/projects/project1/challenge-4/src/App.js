import './App.css';
import { booksData } from "./data/librosData"
import { Form } from './components/form';
import { BotonDelete } from './components/botonDelete';
import { BookStack } from './components/libroStack';
import { useState, useContext } from "react"
import { AuthContext } from '../../../../provider/AuthContext'
import { useNavigate } from 'react-router-dom';


function Biblioteca() {

  const [stack, setStack] = useState(booksData);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const back = () => {
    navigate("/dashboard");
  }

  const addBookStack = (newBook) => {
    setStack([...stack, newBook]);
  }

  const deleteBookStack = () => {
    setStack(stack.slice(0, -1));
  }
  return (


    <div className="biblioteca-wrapper">

      <h1>BIBLIOTECA UAO</h1>

      <div className="stack">
        <BookStack books={stack} />
      </div>


      <Form onAddBook={addBookStack} />

      <BotonDelete
        deleteLastBook={deleteBookStack}
        text="Borrar libro"
        typeBoton="delete" />

      <div className="back-user">
        <BotonDelete
          deleteLastBook={back}
          text="Atrás"
          typeBoton="back" />

        <p className="nameUser">User: {user?.email}</p>
      </div>



    </div>

  )
    ;
}

export default Biblioteca;
