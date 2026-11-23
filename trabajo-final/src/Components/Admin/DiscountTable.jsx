import { formatCOP, formatDate, formatDiscount } from '../../Helpers/formatters';
import styles from './DiscountTable.module.scss';

const statusOf = (discount) => {
  if (!discount.is_active) return { text: 'Inactivo', className: styles.off };
  if (discount.expires_at && new Date(discount.expires_at) < new Date()) return { text: 'Vencido', className: styles.off };
  if (discount.max_uses && discount.used_count >= discount.max_uses) return { text: 'Agotado', className: styles.off };
  return { text: 'Activo', className: styles.on };
};

const DiscountTable = ({ discounts, onToggle, onRemove }) => {
  if (discounts.length === 0) return <p className={styles.empty}>Aún no hay códigos de descuento.</p>;

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descuento</th>
            <th>Compra mínima</th>
            <th>Usos</th>
            <th>Vence</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => {
            const status = statusOf(discount);
            return (
              <tr key={discount.id}>
                <td>
                  <strong className={styles.code}>{discount.code}</strong>
                </td>
                <td>{formatDiscount(discount)}</td>
                <td>{discount.min_purchase > 0 ? formatCOP(discount.min_purchase) : '—'}</td>
                <td>
                  {discount.used_count} / {discount.max_uses ?? '∞'}
                </td>
                <td>{discount.expires_at ? formatDate(discount.expires_at) : 'Sin vencimiento'}</td>
                <td>
                  <span className={status.className}>{status.text}</span>
                </td>
                <td className={styles.actions}>
                  <button type="button" onClick={() => onToggle(discount)}>
                    {discount.is_active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    className={styles.remove}
                    onClick={() => window.confirm(`¿Eliminar el código ${discount.code}?`) && onRemove(discount)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DiscountTable;
