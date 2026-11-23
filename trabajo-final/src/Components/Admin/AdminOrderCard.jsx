import { formatCOP, formatPhone, formatTime, whatsappLink } from '../../Helpers/formatters';
import styles from './AdminOrderCard.module.scss';

const AdminOrderCard = ({ order, isNext, minutesLeft, busy, actionText, onAction, onCancel }) => (
  <article className={isNext ? `${styles.card} ${styles.next}` : styles.card}>
    <header className={styles.header}>
      <strong className={styles.code}>{order.order_code}</strong>
      {isNext && <span className={styles.badge}>Siguiente</span>}
      <span className={styles.total}>{formatCOP(order.total)}</span>
    </header>

    <p className={styles.customer}>
      {order.customer_name} ·{' '}
      <a href={whatsappLink(order.customer_phone, `Hola ${order.customer_name}, te escribimos de Sport Champion por tu pedido ${order.order_code}.`)} target="_blank" rel="noreferrer">
        {formatPhone(order.customer_phone)}
      </a>
    </p>
    <p className={styles.muted}>{order.shipping_address}</p>

    {order.notify_error && <p className={styles.notifyError}>No se pudo enviar el correo de aviso: {order.notify_error}</p>}

    <ul className={styles.items}>
      {order.order_items.map((item) => (
        <li key={item.id}>
          {item.quantity} × {item.product_variants?.products?.name ?? 'Uniforme'} · talla {item.product_variants?.size}
        </li>
      ))}
    </ul>

    <p className={styles.muted}>
      Pedido a las {formatTime(order.created_at)}
      {order.discount_code && ` · código ${order.discount_code}`}
      {minutesLeft !== null && (
        <>
          {' · '}
          <span className={minutesLeft <= 10 ? styles.urgent : ''}>quedan {minutesLeft} min para pagar</span>
        </>
      )}
    </p>

    <div className={styles.actions}>
      <button type="button" onClick={() => onAction(order)} disabled={busy}>
        {actionText}
      </button>
      <button
        type="button"
        className={styles.cancel}
        disabled={busy}
        onClick={() => window.confirm(`¿Cancelar el pedido ${order.order_code}? Las prendas vuelven al inventario.`) && onCancel(order)}
      >
        Cancelar
      </button>
    </div>
  </article>
);

export default AdminOrderCard;
