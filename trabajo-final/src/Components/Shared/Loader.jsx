import styles from './Loader.module.scss';

const Loader = ({ text = 'Cargando…' }) => (
  <div className={styles.loader} role="status">
    <span className={styles.spinner} />
    {text}
  </div>
);

export default Loader;
