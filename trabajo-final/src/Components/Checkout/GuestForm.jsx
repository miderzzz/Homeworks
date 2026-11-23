import PhoneInput from '../Shared/PhoneInput';
import styles from './GuestForm.module.scss';

const FIELDS = [
  { name: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Correo', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Celular', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Dirección de envío', type: 'text', autoComplete: 'street-address' },
];

const GuestForm = ({ form, errors, onChange }) => (
  <div className={styles.fields}>
    {FIELDS.map((field) => (
      <label key={field.name}>
        {field.label}
        {field.name === 'phone' ? (
          <PhoneInput
            code={form.phoneCode}
            number={form.phone}
            onCodeChange={(value) => onChange('phoneCode', value)}
            onNumberChange={(value) => onChange('phone', value)}
            invalid={Boolean(errors.phone)}
          />
        ) : (
          <input
            type={field.type}
            autoComplete={field.autoComplete}
            value={form[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
            aria-invalid={Boolean(errors[field.name])}
          />
        )}
        {errors[field.name] && <span className={styles.error}>{errors[field.name]}</span>}
      </label>
    ))}
  </div>
);

export default GuestForm;
