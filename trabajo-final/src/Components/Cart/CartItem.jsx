import { formatCOP, toTitleCase } from '../../Helpers/formatters';
import { MAX_QUANTITY } from '../../Helpers/constants';
import styles from './CartItem.module.scss';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const max = Math.min(item.maxStock, MAX_QUANTITY);

  return (
    <li className={styles.item}>
      {item.image ? (
        <img className={styles.image} src={item.image} alt={item.name} />
      ) : (
        <div className={styles.image} />
      )}

      <div className={styles.info}>
        <span className={styles.team}>{toTitleCase(item.team)}</span>
        <strong>{item.name}</strong>
        <span className={styles.size}>Talla {item.size}</span>
      </div>

      <div className={styles.quantity}>
        <button type="button" onClick={() => onQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
          −
        </button>
        <span>{item.quantity}</span>
        <button type="button" onClick={() => onQuantityChange(item.quantity + 1)} disabled={item.quantity >= max}>
          +
        </button>
      </div>

      <strong className={styles.price}>{formatCOP(item.price * item.quantity)}</strong>

      <button type="button" className={styles.remove} onClick={onRemove}>
        Quitar
      </button>
    </li>
  );
};

export default CartItem;
