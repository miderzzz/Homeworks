import { Link } from 'react-router-dom';
import fallbackLogo from '../../assets/brand/logo-black.png';
import styles from './LeagueGrid.module.scss';

const LeagueGrid = ({ leagues }) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2>Explora por liga</h2>
      <Link to="/catalogo" className={styles.all}>
        Ver todo el catálogo
      </Link>
    </div>

    <div className={styles.grid}>
      {leagues.map((league) => (
        <Link key={league.id} to={league.path} className={styles.tile}>
          <span className={styles.logoBox}>
            <img
              src={league.logo ?? fallbackLogo}
              alt=""
              className={league.logo ? styles.logo : `${styles.logo} ${styles.fallback}`}
              loading="lazy"
            />
          </span>
          <span className={styles.footer}>
            <span className={styles.name}>{league.name}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
        </Link>
      ))}
    </div>
  </section>
);

export default LeagueGrid;
