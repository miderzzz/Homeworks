import AdminOrderCard from './AdminOrderCard';
import styles from './OrderQueue.module.scss';

const OrderQueue = ({ title, hint, orders, next, busyId, minutesLeft, actionText, onAction, onCancel }) => (
  <section className={styles.queue}>
    <header className={styles.header}>
      <h2>
        {title} <span className={styles.count}>{orders.length}</span>
      </h2>
      <p>{hint}</p>
    </header>

    {orders.length === 0 ? (
      <p className={styles.empty}>No hay pedidos aquí.</p>
    ) : (
      orders.map((order) => (
        <AdminOrderCard
          key={order.id}
          order={order}
          isNext={order.id === next?.id}
          minutesLeft={minutesLeft ? minutesLeft(order) : null}
          busy={busyId === order.id}
          actionText={actionText}
          onAction={onAction}
          onCancel={onCancel}
        />
      ))
    )}
  </section>
);

export default OrderQueue;
