export function NextUser({ text, typeBoton, deleteFirstUser }) {

    return (
        <button className={typeBoton}
            onClick={deleteFirstUser}>
            {text}
        </button>
    )
}
