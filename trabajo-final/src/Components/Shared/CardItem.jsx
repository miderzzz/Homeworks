import { Link } from 'react-router-dom';
import { formatCOP, toTitleCase } from '../../Helpers/formatters';
import { KIT_TYPES, labelOf } from '../../Helpers/constants';
import styles from './CardItem.module.scss';

const CardItem = ({ product }) => {
  const soldOut = product.variants.every((variant) => variant.stock === 0);

  return (
    <article className={styles.card}>
      <Link to={`/producto/${product.id}`} className={styles.link}>
        {product.image_url ? (
          <img className={styles.image} src={product.image_url} alt={product.name} />
        ) : (
          <div className={styles.placeholder}>Sin imagen</div>
        )}
        <span className={styles.team}>{toTitleCase(product.team)}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.kit}>{labelOf(KIT_TYPES, product.kit_type)}</span>
        <p className={styles.price}>{formatCOP(product.price)}</p>
        {soldOut && <span className={styles.soldOut}>Agotado</span>}
      </Link>
    </article>
  );
};

export default CardItem;
