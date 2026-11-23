import { Link } from 'react-router-dom';
import Message from '../Shared/Message';
import { useCart } from '../../Hooks/useCart';
import { useCartDiscount } from '../../Hooks/useCartDiscount';
import { formatCOP, formatDiscount } from '../../Helpers/formatters';
import styles from './CartSummary.module.scss';

const CartSummary = ({ showCheckoutButton = true }) => {
  const { subtotal, total } = useCart();
  const { code, setCode, error, checking, apply, remove, discount, discountAmount, belowMinimum } = useCartDiscount();

  return (
    <aside className={styles.summary}>
      <h3>Resumen</h3>

      <div className={styles.row}>
        <span>Subtotal</span>
        <span>{formatCOP(subtotal)}</span>
      </div>

      {discount ? (
        <div className={styles.discount}>
          <div className={styles.row}>
            <span>
              Descuento <strong>{discount.code}</strong> ({formatDiscount(discount)})
            </span>
            <span>−{formatCOP(discountAmount)}</span>
          </div>
          {belowMinimum && (
            <Message type="error">Este código necesita una compra mínima de {formatCOP(discount.min_purchase)}</Message>
          )}
          <button type="button" className={styles.link} onClick={remove}>
            Quitar código
          </button>
        </div>
      ) : (
        <form className={styles.codeForm} onSubmit={apply}>
          <input
            placeholder="Código de descuento"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
          />
          <button type="submit" disabled={checking || !code.trim()}>
            {checking ? '…' : 'Aplicar'}
          </button>
        </form>
      )}
      <Message type="error">{error}</Message>

      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{formatCOP(total)}</span>
      </div>

      {showCheckoutButton && (
        <Link to="/checkout" className={styles.checkout}>
          Continuar compra
        </Link>
      )}
    </aside>
  );
};

export default CartSummary;
