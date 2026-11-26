import ProductGrid from '../Shared/ProductGrid';
import { useRecommendations } from '../../Hooks/useRecommendations';
import styles from './Recommendations.module.scss';

const Recommendations = ({ productId }) => {
  const products = useRecommendations(productId);
  if (products.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2>También te puede gustar</h2>
      <ProductGrid products={products} />
    </section>
  );
};

export default Recommendations;
