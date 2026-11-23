import { useState } from 'react';
import { formatCOP, formatTime } from '../../Helpers/formatters';
import { BREB_KEY_TYPES } from '../../Helpers/constants';
import styles from './BrebPaymentCard.module.scss';

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className={styles.copy} onClick={copy}>
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
};

const BrebPaymentCard = ({ order }) => (
  <section className={styles.card}>
    <h2>Paga por transferencia Bre-B</h2>

    <dl className={styles.data}>
      <dt>Llave Bre-B ({BREB_KEY_TYPES[order.breb.key_type] ?? order.breb.key_type})</dt>
      <dd>
        <strong>{order.breb.key}</strong>
        <CopyButton value={order.breb.key} />
      </dd>

      <dt>Titular</dt>
      <dd>{order.breb.holder}</dd>

      <dt>Valor a transferir</dt>
      <dd>
        <strong>{formatCOP(order.total)}</strong>
        <CopyButton value={order.total} />
      </dd>

      <dt>Descripción de la transferencia</dt>
      <dd>
        <strong>{order.order_code}</strong>
        <CopyButton value={order.order_code} />
      </dd>
    </dl>

    <ol className={styles.steps}>
      <li>Abre la app de tu banco o billetera y elige transferir con llave Bre-B.</li>
      <li>Escribe la llave, el valor exacto y tu código de compra en la descripción.</li>
      <li>Envía la captura del comprobante por WhatsApp (abajo).</li>
      <li>Verificamos el pago y te avisamos cuando el pedido salga.</li>
    </ol>

    {order.expires_at && (
      <p className={styles.expires}>
        Tu compra está reservada hasta las <strong>{formatTime(order.expires_at)}</strong>.
      </p>
    )}
  </section>
);

export default BrebPaymentCard;
