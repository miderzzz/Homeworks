import { useStoreDistance } from '../../Hooks/useStoreDistance';
import { formatKm, formatMinutes } from '../../Helpers/formatters';
import { directionsUrl } from '../../Helpers/geo';
import styles from './StoreDistance.module.scss';

const MESSAGES = {
  idle: 'Activa tu ubicación para saber qué tan lejos estás de la tienda.',
  locating: 'Buscando tu ubicación…',
  denied: 'No diste permiso de ubicación. Puedes activarlo desde el candado de la barra de direcciones.',
  unsupported: 'Tu navegador no permite usar la ubicación.',
  error: 'No pudimos obtener tu ubicación. Intenta de nuevo.',
};

const StoreDistance = () => {
  const { store, target, status, km, minutes, estimated, start } = useStoreDistance();
  const ready = status === 'ready' && km !== null;

  return (
    <section className={styles.card}>
      <div className={styles.distance}>
        <span className={styles.label}>
          {ready && <span className={styles.live} />}
          {ready ? 'En vivo · Estás a' : 'Visítanos'}
        </span>

        {ready ? (
          <>
            <strong className={styles.km}>{formatKm(km)}</strong>
            <span className={styles.time}>
              {estimated ? '≈ ' : '~ '}
              {formatMinutes(Math.max(1, minutes))} en carro
            </span>
          </>
        ) : (
          <>
            <p className={styles.message}>{MESSAGES[status]}</p>
            {(status === 'idle' || status === 'error') && (
              <button type="button" className={styles.activate} onClick={start}>
                Activar ubicación
              </button>
            )}
          </>
        )}
      </div>

      <div className={styles.store}>
        <span className={styles.label}>Nuestra tienda</span>
        <p className={styles.address}>{store.store_address}</p>
        <a className={styles.directions} href={directionsUrl(target)} target="_blank" rel="noreferrer">
          Cómo llegar
        </a>
      </div>
    </section>
  );
};

export default StoreDistance;
