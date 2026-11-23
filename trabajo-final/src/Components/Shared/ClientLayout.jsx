import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';
import styles from './ClientLayout.module.scss';

const ClientLayout = () => (
  <div className={styles.layout}>
    <Menu />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default ClientLayout;
