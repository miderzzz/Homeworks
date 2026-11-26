function Input({ value, onChange, onEnter, placeholder, type = "text" }) {
  return (
    <input
      className="campo"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === "Enter" && onEnter && onEnter()}
    />
  );
}

export default Input;
