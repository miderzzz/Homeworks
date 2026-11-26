function Button({ children, onClick, variant = "" }) {
  return (
    <button className={`boton ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
