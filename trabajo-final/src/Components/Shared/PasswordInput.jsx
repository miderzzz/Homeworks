import { useState } from 'react';
import styles from './PasswordInput.module.scss';

const EyeIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {!open && <path d="M4 4l16 16" />}
  </svg>
);

const PasswordInput = ({ value, onChange, autoComplete, placeholder, id }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        <EyeIcon open={!visible} />
      </button>
    </div>
  );
};

export default PasswordInput;
