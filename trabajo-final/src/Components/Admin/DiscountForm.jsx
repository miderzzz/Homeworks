import Message from '../Shared/Message';
import { useDiscountForm } from '../../Hooks/useDiscountForm';
import { DISCOUNT_TYPES } from '../../Helpers/constants';
import styles from './DiscountForm.module.scss';

const DiscountForm = ({ onCreate }) => {
  const { form, setField, error, saving, submit } = useDiscountForm(onCreate);
  const isPercent = form.discount_type === 'porcentaje';

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <h2>Nuevo código</h2>
      <div className={styles.grid}>
        <label>
          Código
          <input
            value={form.code}
            placeholder="EJ: VERANO20"
            maxLength={20}
            onChange={(event) => setField('code', event.target.value)}
          />
        </label>
        <label>
          Tipo
          <select value={form.discount_type} onChange={(event) => setField('discount_type', event.target.value)}>
            {DISCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {isPercent ? 'Porcentaje (1 a 90)' : 'Valor en pesos'}
          <input
            type="number"
            min="1"
            max={isPercent ? 90 : undefined}
            value={form.value}
            onChange={(event) => setField('value', event.target.value)}
          />
        </label>
        <label>
          Compra mínima (opcional)
          <input
            type="number"
            min="0"
            value={form.min_purchase}
            onChange={(event) => setField('min_purchase', event.target.value)}
          />
        </label>
        <label>
          Usos máximos (opcional)
          <input
            type="number"
            min="1"
            value={form.max_uses}
            onChange={(event) => setField('max_uses', event.target.value)}
          />
        </label>
        <label>
          Vence (opcional)
          <input
            type="datetime-local"
            value={form.expires_at}
            onChange={(event) => setField('expires_at', event.target.value)}
          />
        </label>
      </div>
      <Message type="error">{error}</Message>
      <button type="submit" disabled={saving}>
        {saving ? 'Creando…' : 'Crear código'}
      </button>
    </form>
  );
};

export default DiscountForm;
