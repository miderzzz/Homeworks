export function BotonDelete({ text, typeBoton, deleteLastBook }) {

    return (
        <button className={typeBoton}
            onClick={deleteLastBook}>
            {text}
        </button>
    )
}

