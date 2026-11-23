import CardItem from './CardItem';
import styles from './ProductGrid.module.scss';

const ProductGrid = ({ products, emptyText = 'No hay uniformes para mostrar' }) => {
  if (products.length === 0) return <p className={styles.empty}>{emptyText}</p>;

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <CardItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
