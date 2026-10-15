export function Button({ text, typeButton, type = "button", onClick }) {
    return (
        <button className={typeButton} type={type} onClick={onClick}>
            {text}
        </button>
    );
}