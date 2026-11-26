import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Footer from './Footer';
import WhatsappButton from './WhatsappButton';
import styles from './ClientLayout.module.scss';

const ClientLayout = () => (
  <div className={styles.layout}>
    <Menu />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
    <WhatsappButton />
  </div>
);

export default ClientLayout;
