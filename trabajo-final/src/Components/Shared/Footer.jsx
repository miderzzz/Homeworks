import { STORE_NAME } from '../../Helpers/constants';
import wordmark from '../../assets/brand/name-white.png';
import styles from './Footer.module.scss';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <img src={wordmark} alt={STORE_NAME} className={styles.wordmark} />
      <div className={styles.info}>
        <p>
          <span>Contáctanos</span>+57 317 519 0835
        </p>
        <p>
          <span>Visítanos</span>Centro Comercial El Caleño, Local 527
        </p>
      </div>
    </div>
    <p className={styles.copy}>Copyright © 2026 Sport Champion. Todos los derechos reservados.</p>
  </footer>
);

export default Footer;
