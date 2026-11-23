import { Link } from 'react-router-dom';
import StockRow from './StockRow';
import { toTitleCase } from '../../Helpers/formatters';
import { KIT_TYPES, labelOf } from '../../Helpers/constants';
import styles from './InventoryItem.module.scss';

const InventoryItem = ({ product, stockOf, busy, onChange, onSet }) => {
  const total = product.variants.reduce((sum, variant) => sum + stockOf(variant), 0);

  return (
    <article className={product.is_active ? styles.item : `${styles.item} ${styles.inactive}`}>
      <header className={styles.header}>
        {product.image_url ? (
          <img className={styles.thumb} src={product.image_url} alt={product.name} />
        ) : (
          <div className={styles.thumb} />
        )}
        <div className={styles.info}>
          <strong>{product.name}</strong>
          <span className={styles.muted}>
            {toTitleCase(product.team)} · {labelOf(KIT_TYPES, product.kit_type)}
            {!product.is_active && ' · Oculto'}
          </span>
        </div>
        <span className={styles.total}>{total} en total</span>
      </header>

      {product.variants.length === 0 ? (
        <p className={styles.muted}>
          Sin tallas. <Link to={`/admin/uniformes/${product.id}`}>Edita el uniforme</Link> para agregarlas.
        </p>
      ) : (
        <div className={styles.sizes}>
          {product.variants.map((variant) => (
            <StockRow
              key={variant.id}
              size={variant.size}
              stock={stockOf(variant)}
              busy={busy === variant.id || busy === 'undo'}
              onChange={(delta) => onChange(product, variant, delta)}
              onSet={(value) => onSet(product, variant, value)}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default InventoryItem;
