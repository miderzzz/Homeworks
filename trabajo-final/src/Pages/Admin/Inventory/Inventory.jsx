import InventoryItem from '../../../Components/Admin/InventoryItem';
import Loader from '../../../Components/Shared/Loader';
import Message from '../../../Components/Shared/Message';
import { useInventory } from '../../../Hooks/useInventory';
import styles from './Inventory.module.scss';

const Inventory = () => {
  const inventory = useInventory();

  return (
    <div className={styles.page}>
      <header>
        <h1>Inventario</h1>
        <p className={styles.intro}>
          Ajusta las existencias de cada talla. Usa − y +, o escribe la cantidad exacta y presiona Enter.
        </p>
      </header>

      <div className={styles.toolbar}>
        <label>
          Buscar
          <input
            type="search"
            placeholder="Equipo, liga o nombre"
            value={inventory.query}
            onChange={(event) => inventory.setQuery(event.target.value)}
          />
        </label>
      </div>

      {inventory.lastAction && (
        <div className={styles.undo}>
          <span>
            Último cambio: <strong>{inventory.lastAction.delta > 0 ? `+${inventory.lastAction.delta}` : inventory.lastAction.delta}</strong>{' '}
            en {inventory.lastAction.label}
          </span>
          <button type="button" onClick={inventory.undo} disabled={inventory.busy === 'undo'}>
            Deshacer ({inventory.pendingUndos})
          </button>
        </div>
      )}

      <Message type="error">{inventory.error}</Message>

      {inventory.loading ? (
        <Loader />
      ) : (
        <div className={styles.list}>
          {inventory.products.length === 0 && <Message>No hay uniformes que coincidan.</Message>}
          {inventory.products.map((product) => (
            <InventoryItem
              key={product.id}
              product={product}
              stockOf={inventory.stockOf}
              busy={inventory.busy}
              onChange={inventory.change}
              onSet={inventory.setExact}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
