import { formatCOP, formatDate } from '../../Helpers/formatters';
import { ORDER_STATUS } from '../../Helpers/constants';
import styles from './OrderCard.module.scss';

const OrderCard = ({ order }) => (
  <article className={styles.card}>
    <header className={styles.header}>
      <strong className={styles.code}>{order.order_code}</strong>
      <span className={`${styles.status} ${styles[order.status]}`}>{ORDER_STATUS[order.status]}</span>
    </header>
    <p className={styles.date}>{formatDate(order.created_at)}</p>
    <ul className={styles.items}>
      {order.order_items.map((item) => (
        <li key={item.id}>
          {item.quantity} × {item.product_variants?.products?.name ?? 'Uniforme'} (talla {item.product_variants?.size}) ·{' '}
          {formatCOP(item.unit_price * item.quantity)}
        </li>
      ))}
    </ul>
    {order.discount_amount > 0 && (
      <p className={styles.discount}>
        Descuento {order.discount_code}: −{formatCOP(order.discount_amount)}
      </p>
    )}
    <p className={styles.total}>Total: {formatCOP(order.total)}</p>
  </article>
);

export default OrderCard;
