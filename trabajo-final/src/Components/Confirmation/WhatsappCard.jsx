import { formatCOP, formatPhone, whatsappLink } from '../../Helpers/formatters';
import styles from './WhatsappCard.module.scss';

const WhatsappCard = ({ order }) => {
  if (!order.whatsapp) return null;

  const message = `Hola Sport Champion, envío el comprobante de mi compra ${order.order_code} por ${formatCOP(order.total)}.`;

  return (
    <section className={styles.card}>
      <div>
        <h3>Envía la captura de tu transferencia</h3>
        <p>
          Cuando pagues, manda la captura del comprobante por WhatsApp al <strong>{formatPhone(order.whatsapp)}</strong>{' '}
          con tu código <strong>{order.order_code}</strong>.
        </p>
      </div>
      <a className={styles.button} href={whatsappLink(order.whatsapp, message)} target="_blank" rel="noreferrer">
        Abrir WhatsApp
      </a>
    </section>
  );
};

export default WhatsappCard;
