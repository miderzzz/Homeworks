import { Link } from 'react-router-dom';
import { formatCOP, toTitleCase } from '../../Helpers/formatters';
import { KIT_FORMATS, KIT_TYPES, SLEEVE_TYPES, labelOf } from '../../Helpers/constants';
import styles from './ProductTable.module.scss';

const ProductTable = ({ products, busyId, onToggle }) => {
  if (products.length === 0) return <p className={styles.empty}>Todavía no hay uniformes. Crea el primero.</p>;

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Uniforme</th>
            <th>Versión / manga / formato</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
            return (
              <tr key={product.id} className={product.is_active ? '' : styles.inactive}>
                <td>
                  {product.image_url ? (
                    <img className={styles.thumb} src={product.image_url} alt={product.name} />
                  ) : (
                    <div className={styles.thumb} />
                  )}
                </td>
                <td>
                  <strong>{product.name}</strong>
                  <div className={styles.muted}>
                    {toTitleCase(product.team)} · {toTitleCase(product.league)}
                  </div>
                </td>
                <td>
                  {labelOf(KIT_TYPES, product.kit_type)}
                  <div className={styles.muted}>
                    {labelOf(SLEEVE_TYPES, product.sleeve_type)} · {labelOf(KIT_FORMATS, product.kit_format)}
                  </div>
                </td>
                <td>{formatCOP(product.price)}</td>
                <td>
                  <span className={stock < 5 ? styles.low : ''}>{stock}</span>
                  <div className={styles.muted}>
                    {product.variants.filter((variant) => variant.stock > 0).map((variant) => variant.size).join(' · ') || 'Sin tallas'}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className={product.is_active ? styles.active : styles.hidden}
                    disabled={busyId === product.id}
                    onClick={() => onToggle(product)}
                  >
                    {product.is_active ? 'Visible' : 'Oculto'}
                  </button>
                </td>
                <td>
                  <Link to={`/admin/uniformes/${product.id}`}>Editar</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
