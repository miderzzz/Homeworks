import { Link } from 'react-router-dom';
import logo from '../../assets/brand/logo-white.png';
import styles from './HeroBanner.module.scss';

const HeroBanner = () => (
  <section className={styles.hero}>
    <div className={styles.content}>
      <span className={styles.eyebrow}>Temporada 2026</span>
      <h1 className={styles.title}>
        Viste los colores <em>de tu equipo</em>
      </h1>
      <p className={styles.text}>Uniformes de las mejores ligas del mundo, en todas las tallas.</p>
      <Link to="/catalogo" className={styles.cta}>
        Ver catálogo
      </Link>
    </div>
    <img src={logo} alt="" className={styles.mark} />
  </section>
);

export default HeroBanner;
