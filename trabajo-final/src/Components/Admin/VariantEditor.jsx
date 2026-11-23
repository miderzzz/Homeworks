import { SIZES } from '../../Helpers/constants';
import styles from './VariantEditor.module.scss';

const VariantEditor = ({ variants, onToggle, onStock, error }) => (
  <fieldset className={styles.editor}>
    <legend>Tallas y existencias</legend>
    <div className={styles.grid}>
      {SIZES.map((size) => {
        const variant = variants[size];
        return (
          <div key={size} className={variant.enabled ? `${styles.size} ${styles.enabled}` : styles.size}>
            <label className={styles.check}>
              <input type="checkbox" checked={variant.enabled} onChange={() => onToggle(size)} />
              {size}
            </label>
            <input
              type="number"
              min="0"
              value={variant.stock}
              disabled={!variant.enabled}
              onChange={(event) => onStock(size, event.target.value)}
              aria-label={`Existencias talla ${size}`}
            />
          </div>
        );
      })}
    </div>
    {error && (
      <span className={styles.error} data-error="true">
        {error}
      </span>
    )}
  </fieldset>
);

export default VariantEditor;
