import { Outlet } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import styles from './AdminLayout.module.scss';

const AdminLayout = () => (
  <div className={styles.layout}>
    <AdminMenu />
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
