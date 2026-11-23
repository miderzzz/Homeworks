import styles from './SizeSelector.module.scss';

const SizeSelector = ({ variants, selectedId, onSelect }) => (
  <div className={styles.sizes}>
    {variants.map((variant) => (
      <button
        key={variant.id}
        type="button"
        disabled={variant.stock === 0}
        className={variant.id === selectedId ? `${styles.size} ${styles.selected}` : styles.size}
        onClick={() => onSelect(variant.id)}
      >
        {variant.size}
      </button>
    ))}
  </div>
);

export default SizeSelector;
