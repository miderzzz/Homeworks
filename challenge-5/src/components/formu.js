import { useState } from "react"
import { createUser } from "../class/paciente"

export function Form({ onAddUser }) {

    const [ user, setUser ] = useState({userName: "", idUser: "", withdrawalAmount: ""})

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = createUser(user.userName, user.idUser, user.withdrawalAmount)
        onAddUser(newUser);
        setUser({ userName: "", idUser: "", withdrawalAmount: ""})

    }

    return(
        <form onSubmit={handleSubmit}>

            <input
                value={user.userName}
                onChange={(e) => setUser({ ...user, userName: e.target.value })}
                placeholder="Nombre del Usuario" />
            <input
                value={user.idUser}
                onChange={(e) => setUser({ ...user, idUser: e.target.value })}
                placeholder="Id del Usuario" />
            <input
                value={user.withdrawalAmount}
                onChange={(e) => setUser({ ...user, withdrawalAmount: e.target.value })}
                placeholder="Cantidad de retiro" />

            <button type="submit"> Agregar usuario a la cola </button>
        </form>
    )}
