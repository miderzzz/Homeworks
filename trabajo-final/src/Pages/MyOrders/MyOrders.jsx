import OrderCard from '../../Components/MyOrders/OrderCard';
import Loader from '../../Components/Shared/Loader';
import Message from '../../Components/Shared/Message';
import { useMyOrders } from '../../Hooks/useMyOrders';
import styles from './MyOrders.module.scss';

const MyOrders = () => {
  const { orders, loading, error } = useMyOrders();

  return (
    <div className={styles.page}>
      <h1>Mis pedidos</h1>
      {loading && <Loader />}
      <Message type="error">{error}</Message>
      {!loading && orders.length === 0 && !error && <Message>Aún no tienes pedidos.</Message>}
      <div className={styles.list}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
