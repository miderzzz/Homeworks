import { Link } from 'react-router-dom';
import ProductTable from '../../../Components/Admin/ProductTable';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useAdminProducts } from '../../../Hooks/useAdminProducts';
import styles from './Products.module.scss';

const Products = () => {
  const { products, loading, error, busyId, toggleActive } = useAdminProducts();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Uniformes</h1>
        <Link to="/admin/uniformes/nuevo" className={styles.new}>
          + Nuevo uniforme
        </Link>
      </header>
      <Message type="error">{error}</Message>
      {loading ? <Loader /> : <ProductTable products={products} busyId={busyId} onToggle={toggleActive} />}
    </div>
  );
};

export default Products;
