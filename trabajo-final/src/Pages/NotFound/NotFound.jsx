import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => (
  <div className={styles.page}>
    <h1>404</h1>
    <p>Esta página no existe.</p>
    <Link to="/">Volver al inicio</Link>
  </div>
);

export default NotFound;
