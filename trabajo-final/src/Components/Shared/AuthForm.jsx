import Message from './Message';
import PhoneInput from './PhoneInput';
import PasswordInput from './PasswordInput';
import logo from '../../assets/brand/logo-white.png';
import styles from './AuthForm.module.scss';

const FIELDS = {
  login: [
    { name: 'email', label: 'Correo', type: 'email', autoComplete: 'email', placeholder: 'tucorreo@ejemplo.com' },
    { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'current-password', placeholder: 'Contraseña' },
  ],
  register: [
    { name: 'fullName', label: 'Nombre completo', type: 'text', autoComplete: 'name', placeholder: 'Nombre y apellido' },
    { name: 'phone', label: 'Celular', type: 'tel' },
    { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', placeholder: 'tucorreo@ejemplo.com' },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      autoComplete: 'new-password',
      placeholder: 'Mínimo 6 caracteres',
    },
  ],
};

const AuthForm = ({
  mode,
  variant = 'light',
  eyebrow,
  title,
  subtitle,
  submitText,
  form,
  onChange,
  onSubmit,
  error,
  message,
  saving,
  footer,
}) => {
  const renderControl = (field) => {
    if (field.name === 'phone') {
      return (
        <PhoneInput
          code={form.phoneCode}
          number={form.phone}
          onCodeChange={(value) => onChange('phoneCode', value)}
          onNumberChange={(value) => onChange('phone', value)}
        />
      );
    }
    if (field.type === 'password') {
      return (
        <PasswordInput
          value={form.password}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
          onChange={(value) => onChange('password', value)}
        />
      );
    }
    return (
      <input
        type={field.type}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        value={form[field.name]}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    );
  };

  return (
    <form className={`${styles.form} ${styles[variant]}`} onSubmit={onSubmit} noValidate>
      <header className={styles.header}>
        {variant === 'light' && (
          <span className={styles.badge}>
            <img src={logo} alt="" />
          </span>
        )}
        <div>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>

      <div className={styles.fields}>
        {FIELDS[mode].map((field) => (
          <label key={field.name} className={styles.field}>
            <span className={styles.label}>{field.label}</span>
            {renderControl(field)}
            {field.hint && <small className={styles.hint}>{field.hint}</small>}
          </label>
        ))}
      </div>

      <Message type="error">{error}</Message>
      <Message type="success">{message}</Message>

      <button type="submit" className={styles.submit} disabled={saving}>
        {saving ? 'Un momento…' : submitText}
      </button>

      <div className={styles.footer}>{footer}</div>
    </form>
  );
};

export default AuthForm;
