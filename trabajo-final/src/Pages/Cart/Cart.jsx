import { Link } from 'react-router-dom';
import CartItem from '../../Components/Cart/CartItem';
import CartSummary from '../../Components/Cart/CartSummary';
import { useCart } from '../../Hooks/useCart';
import styles from './Cart.module.scss';

const Cart = () => {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h1>Tu carrito está vacío</h1>
        <Link to="/catalogo">Ver uniformes</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section>
        <h1>Carrito</h1>
        <ul className={styles.list}>
          {items.map((item) => (
            <CartItem
              key={item.variantId}
              item={item}
              onQuantityChange={(quantity) => updateQuantity(item.variantId, quantity)}
              onRemove={() => removeItem(item.variantId)}
            />
          ))}
        </ul>
      </section>
      <CartSummary />
    </div>
  );
};

export default Cart;
