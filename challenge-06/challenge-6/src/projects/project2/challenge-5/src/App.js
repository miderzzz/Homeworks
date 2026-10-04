import './App.css';
import { userData } from "./data/mockUser"
import { Form } from "./components/formu"
import { NextUser } from "./components/boton"
import { UserQueue } from "./components/filaQueue"
import { useState, useContext } from "react"
import { AuthContext } from '../../../../provider/AuthContext'
import { useNavigate } from 'react-router-dom';


function Banco() {

  const [queue, setQueue] = useState([...userData].sort((a, b) => a.dateArrival - b.dateArrival))
  const [currentUser, setCurrentUser] = useState(null)
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const back = () => {
    navigate("/dashboard");
  }

  const addUser = (newUser) => {
    const updateQueue = [...queue, newUser].sort((a, b) => a.dateArrival - b.dateArrival)
    setQueue(updateQueue);
  }


  const AttendNextUser = () => {
    if (queue.length === 0) return;
    const nextInLine = queue[0];
    setCurrentUser(nextInLine)
    setQueue(queue.slice(1))

  }




  return (
    <div className="banco-wrapper">
      <h1>BANCO UAO</h1>

      <div className="queueGrafic">
        <UserQueue users={queue} />
        <span className="userInTurn">{currentUser ? currentUser.userName : "Sin turno aún"}
        </span>
      </div>

      <Form onAddUser={addUser} />

      <NextUser
        typeBoton="next"
        deleteFirstUser={AttendNextUser}
        text="Siguiente usuario" />

        <div className="back-user">
        <NextUser
          deleteFirstUser={back}
          text="Atrás"
          typeBoton="back" />

        <p className="nameUser">User: {user?.email}</p>
      </div>

    </div>
  );

}
export default Banco;
