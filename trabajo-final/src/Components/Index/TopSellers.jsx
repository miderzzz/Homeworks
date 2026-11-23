import ProductGrid from '../Shared/ProductGrid';
import styles from './TopSellers.module.scss';

const TopSellers = ({ products }) => (
  <section className={styles.section}>
    <h2>Los más vendidos</h2>
    <ProductGrid products={products} emptyText="Pronto tendremos uniformes disponibles" />
  </section>
);

export default TopSellers;
