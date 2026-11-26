import styles from './FilterPanel.module.scss';

const FilterChips = ({ title, options, selected, onToggle }) => (
  <fieldset className={styles.group}>
    <legend>{title}</legend>
    <div className={styles.chips}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
            aria-pressed={active}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </fieldset>
);

export default FilterChips;
