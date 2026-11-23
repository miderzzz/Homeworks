import { COUNTRY_CODES } from '../../Helpers/constants';
import styles from './PhoneInput.module.scss';

const PhoneInput = ({ code, number, onCodeChange, onNumberChange, invalid }) => (
  <div className={styles.phone}>
    <select value={code} onChange={(event) => onCodeChange(event.target.value)} aria-label="Indicativo del país">
      {COUNTRY_CODES.map((country) => (
        <option key={country.code} value={country.code}>
          +{country.code} {country.country}
        </option>
      ))}
    </select>
    <input
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      placeholder="Número"
      value={number}
      onChange={(event) => onNumberChange(event.target.value.replace(/[^\d\s]/g, ''))}
      aria-invalid={invalid}
    />
  </div>
);

export default PhoneInput;
