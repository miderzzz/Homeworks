import { Link, Navigate } from 'react-router-dom';
import GuestForm from '../../Components/Checkout/GuestForm';
import CartSummary from '../../Components/Cart/CartSummary';
import Message from '../../Components/Shared/Message';
import { useCart } from '../../Hooks/useCart';
import { useCheckout } from '../../Hooks/useCheckout';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const { items } = useCart();
  const { form, setField, errors, submitError, saving, submit, isGuest } = useCheckout();

  if (items.length === 0 && !saving) return <Navigate to="/carrito" replace />;

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <h1>Datos de envío</h1>
        {isGuest && (
          <Message>
            Puedes comprar sin cuenta. Si ya tienes una,{' '}
            <Link to="/login" state={{ from: '/checkout' }}>
              inicia sesión
            </Link>{' '}
            para ver tus pedidos después.
          </Message>
        )}
        <GuestForm form={form} errors={errors} onChange={setField} />
        <Message type="error">{submitError}</Message>
        <button type="submit" disabled={saving}>
          {saving ? 'Confirmando…' : 'Confirmar compra'}
        </button>
      </form>
      <CartSummary showCheckoutButton={false} />
    </div>
  );
};

export default Checkout;
