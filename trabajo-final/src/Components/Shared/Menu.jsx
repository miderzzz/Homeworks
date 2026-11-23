import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useCart } from '../../Hooks/useCart';
import { STORE_NAME } from '../../Helpers/constants';
import logo from '../../assets/brand/logo-white.png';
import wordmark from '../../assets/brand/name-white.png';
import styles from './Menu.module.scss';

const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

const Menu = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={styles.menu}>
      <Link to="/" className={styles.brand} aria-label={STORE_NAME}>
        <img src={logo} alt="" className={styles.logo} />
        <img src={wordmark} alt={STORE_NAME} className={styles.wordmark} />
      </Link>

      <ul className={styles.links}>
        <li>
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/catalogo" className={linkClass}>
            Catálogo
          </NavLink>
        </li>
        <li>
          <NavLink to="/carrito" className={linkClass}>
            Carrito
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </NavLink>
        </li>
      </ul>

      <div className={styles.account}>
        {user ? (
          <>
            <span className={styles.user}>Hola, {profile?.full_name?.split(' ')[0] || user.email}</span>
            <NavLink to="/mis-pedidos" className={linkClass}>
              Mis pedidos
            </NavLink>
            {isAdmin && (
              <Link to="/admin" className={styles.adminLink}>
                Panel admin
              </Link>
            )}
            <button type="button" className={styles.logout} onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Iniciar sesión
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Menu;
