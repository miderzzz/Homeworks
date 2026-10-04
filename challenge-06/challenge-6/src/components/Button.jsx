export function Button({ text, typeBoton, onClick }) {
    return (
        <button className={typeBoton} onClick={onClick}>
            {text}
        </button>
    )
}