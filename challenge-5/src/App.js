import './App.css';
import { userData } from "./data/mockUser"
import { Form } from "./components/formu"
import { NextUser } from "./components/boton"
import { UserQueue } from "./components/filaQueue"
import { useState } from "react"


function App() {

  const [queue, setQueue] = useState([...userData].sort((a, b) => a.dateArrival - b.dateArrival))
  const [currentUser, setCurrentUser] = useState(null)

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
    <div className="App">
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

    </div>
  );

}
export default App;
