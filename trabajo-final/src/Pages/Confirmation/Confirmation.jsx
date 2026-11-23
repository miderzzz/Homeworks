import { Link, useLocation, useParams } from 'react-router-dom';
import BrebPaymentCard from '../../Components/Confirmation/BrebPaymentCard';
import WhatsappCard from '../../Components/Confirmation/WhatsappCard';
import Message from '../../Components/Shared/Message';
import { formatCOP } from '../../Helpers/formatters';
import styles from './Confirmation.module.scss';

const Confirmation = () => {
  const { code } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  if (!order || order.order_code !== code) {
    return (
      <Message>
        Tu código de compra es <strong>{code}</strong>. Guárdalo para cualquier consulta. <Link to="/">Volver al inicio</Link>
      </Message>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>¡Compra confirmada!</p>
        <h1>
          Tu código de compra es <span className={styles.code}>{order.order_code}</span>
        </h1>
        <p>Guárdalo: lo necesitas para pagar y para consultar tu pedido.</p>
      </header>

      <div className={styles.totals}>
        <span>Subtotal: {formatCOP(order.subtotal)}</span>
        {order.discount_amount > 0 && (
          <span>
            Descuento {order.discount_code}: −{formatCOP(order.discount_amount)}
          </span>
        )}
        <strong>Total: {formatCOP(order.total)}</strong>
      </div>

      <BrebPaymentCard order={order} />

      <WhatsappCard order={order} />

      <Link to="/catalogo">Seguir comprando</Link>
    </div>
  );
};

export default Confirmation;
