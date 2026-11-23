import OrderQueue from '../../../Components/Admin/OrderQueue';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useAdminOrders } from '../../../Hooks/useAdminOrders';
import styles from './Orders.module.scss';

const Orders = () => {
  const orders = useAdminOrders();

  return (
    <div className={styles.page}>
      <header>
        <h1>Pedidos</h1>
        <p className={styles.intro}>
          Se atienden en orden de llegada. Los pedidos nuevos aparecen solos; los que no se pagan a tiempo se cancelan y
          sus prendas vuelven al inventario.
        </p>
      </header>

      <Message type="error">{orders.error}</Message>

      {orders.loading ? (
        <Loader />
      ) : (
        <div className={styles.columns}>
          <OrderQueue
            title="Por verificar pago"
            hint="Revisa en tu banco la transferencia Bre-B con el código del pedido y la captura que llega por WhatsApp."
            orders={orders.toVerify}
            next={orders.nextToVerify}
            busyId={orders.busyId}
            minutesLeft={orders.minutesLeft}
            actionText="Confirmar pago"
            onAction={orders.confirmPayment}
            onCancel={orders.cancel}
          />
          <OrderQueue
            title="Por despachar"
            hint="Pagos confirmados. Empaca y marca como enviado."
            orders={orders.toShip}
            next={orders.nextToShip}
            busyId={orders.busyId}
            actionText="Marcar enviado"
            onAction={orders.markShipped}
            onCancel={orders.cancel}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
