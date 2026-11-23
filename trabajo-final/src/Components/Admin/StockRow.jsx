import { useState } from 'react';
import { LOW_STOCK } from '../../Helpers/constants';
import styles from './StockRow.module.scss';

const StockRow = ({ size, stock, busy, onChange, onSet }) => {
  const [draft, setDraft] = useState(String(stock));
  const [lastStock, setLastStock] = useState(stock);

  if (stock !== lastStock) {
    setLastStock(stock);
    setDraft(String(stock));
  }

  const commit = () => {
    if (draft === '' || Number(draft) === stock) {
      setDraft(String(stock));
      return;
    }
    onSet(draft);
  };

  const className = [styles.row, stock === 0 ? styles.empty : '', stock > 0 && stock < LOW_STOCK ? styles.low : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <span className={styles.size}>{size}</span>
      <div className={styles.controls}>
        <button type="button" onClick={() => onChange(-1)} disabled={busy || stock === 0} aria-label={`Quitar una ${size}`}>
          −
        </button>
        <input
          type="number"
          min="0"
          value={draft}
          disabled={busy}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
          aria-label={`Existencias talla ${size}`}
        />
        <button type="button" onClick={() => onChange(1)} disabled={busy} aria-label={`Agregar una ${size}`}>
          +
        </button>
      </div>
    </div>
  );
};

export default StockRow;
