import DiscountForm from '../../../Components/Admin/DiscountForm';
import DiscountTable from '../../../Components/Admin/DiscountTable';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useDiscounts } from '../../../Hooks/useDiscounts';
import styles from './Discounts.module.scss';

const Discounts = () => {
  const { discounts, loading, error, create, toggle, remove } = useDiscounts();

  return (
    <div className={styles.page}>
      <h1>Códigos de descuento</h1>
      <p className={styles.intro}>
        Crea códigos que los clientes escriben en el carrito. El descuento se valida otra vez al confirmar la compra.
      </p>
      <DiscountForm onCreate={create} />
      <Message type="error">{error}</Message>
      {loading ? <Loader /> : <DiscountTable discounts={discounts} onToggle={toggle} onRemove={remove} />}
    </div>
  );
};

export default Discounts;
