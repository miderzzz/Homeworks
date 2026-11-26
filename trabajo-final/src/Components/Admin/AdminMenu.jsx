import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { STORE_NAME } from '../../Helpers/constants';
import logo from '../../assets/brand/logo-white.png';
import styles from './AdminMenu.module.scss';

const linkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

const AdminMenu = () => {
  const { user, isOwner, signOut } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={styles.menu}>
      <div className={styles.head}>
        <img src={logo} alt="" className={styles.logo} />
        <div>
          <span className={styles.brand}>{STORE_NAME}</span>
          <span className={styles.subtitle}>Panel de administración</span>
        </div>
      </div>

      <ul className={styles.links}>
        <li>
          <NavLink to="/admin/pedidos" className={linkClass}>
            Pedidos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/uniformes" className={linkClass}>
            Uniformes
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/inventario" className={linkClass}>
            Inventario
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/descuentos" className={linkClass}>
            Códigos de descuento
          </NavLink>
        </li>
        {isOwner && (
          <li>
            <NavLink to="/admin/equipo" className={linkClass}>
              Equipo
            </NavLink>
          </li>
        )}
        <li>
          <Link to="/" className={styles.link}>
            Ver tienda
          </Link>
        </li>
      </ul>

      <div className={styles.account}>
        <span className={styles.role}>{isOwner ? 'Dueño' : 'Empleado'}</span>
        <span>{user?.email}</span>
        <button type="button" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
};

export default AdminMenu;
