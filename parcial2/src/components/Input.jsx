export function Input({ text, type, onChange, placeholder }) {
    return (
        <input onChange={onChange} className={type} placeholder={placeholder}>
            {text}
        </input>
    );
}