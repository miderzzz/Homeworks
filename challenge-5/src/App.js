import './App.css';
import { userData } from "./data/mockUser"
import { Form } from "./components/formu"
import { NextUser } from "./components/boton"
import { UserQueue } from "./components/filaQueue"
import { Queue } from "./class/Queue"
import { useState } from "react"

const byArrival = (a, b) => a.dateArrival - b.dateArrival;

const createInitialQueue = () => {
  const queue = new Queue();
  [...userData].sort(byArrival).forEach((user) => queue.enqueue(user));
  return queue;
};

// Profe, esto es porque como tiene que asigarle una fecha random, entonces no lo puedo poner de una en la fila
const enqueueByArrival = (queue, newUser) => {
  const waiting = [];
  while (!queue.isEmpty()) waiting.push(queue.dequeue());
  [...waiting, newUser].sort(byArrival).forEach((user) => queue.enqueue(user));
};

function App() {
  const [queue] = useState(createInitialQueue);
  const [people, setPeople] = useState(() => queue.toarray());
  const [currentUser, setCurrentUser] = useState(null);

  const addUser = (newUser) => {
    enqueueByArrival(queue, newUser);
    setPeople(queue.toarray());
  }

  const attendNextUser = () => {
    if (queue.isEmpty()) return;
    setCurrentUser(queue.dequeue());
    setPeople(queue.toarray());
  }

  return (
    <div className="App">
      <h1>BANCO UAO</h1>

      <div className="queueGrafic">
        <UserQueue users={people} />
        <span className="userInTurn">
          {currentUser ? currentUser.userName : "Sin turno aún"}
        </span>
      </div>

      <Form onAddUser={addUser} />

      <NextUser
        typeBoton="next"
        deleteFirstUser={attendNextUser}
        text="Siguiente usuario" />
    </div>
  );
}

export default App;