import FilterChips from './FilterChips';
import { KIT_FORMATS, KIT_TYPES, SIZES, SLEEVE_TYPES } from '../../Helpers/constants';
import { SORT_OPTIONS } from '../../Helpers/productFilters';
import { formatCOP } from '../../Helpers/formatters';
import styles from './FilterPanel.module.scss';

const SIZE_OPTIONS = SIZES.map((size) => ({ value: size, label: size }));

const FilterPanel = ({ filters, total, bounds, activeCount, open, onToggleOpen, onToggle, onField, onReset, hideKitType }) => (
  <section className={styles.panel}>
    <div className={styles.bar}>
      <span className={styles.total}>
        {total} {total === 1 ? 'uniforme' : 'uniformes'}
      </span>
      <button
        type="button"
        className={open ? `${styles.toggle} ${styles.toggleOpen}` : styles.toggle}
        onClick={onToggleOpen}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        Filtrado avanzado
        {activeCount > 0 && <span className={styles.count}>{activeCount}</span>}
      </button>
      <label className={styles.sort}>
        <span>Ordenar</span>
        <select value={filters.sort} onChange={(event) => onField('sort', event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>

    <div className={open ? `${styles.body} ${styles.open}` : styles.body}>
      <FilterChips
        title="Talla"
        options={SIZE_OPTIONS}
        selected={filters.sizes}
        onToggle={(value) => onToggle('sizes', value)}
      />
      {!hideKitType && (
        <FilterChips
          title="Tipo"
          options={KIT_TYPES}
          selected={filters.kitTypes}
          onToggle={(value) => onToggle('kitTypes', value)}
        />
      )}
      <FilterChips
        title="Manga"
        options={SLEEVE_TYPES}
        selected={filters.sleeves}
        onToggle={(value) => onToggle('sleeves', value)}
      />
      <FilterChips
        title="Formato"
        options={KIT_FORMATS}
        selected={filters.formats}
        onToggle={(value) => onToggle('formats', value)}
      />

      <fieldset className={styles.group}>
        <legend>Precio</legend>
        <div className={styles.prices}>
          <input
            inputMode="numeric"
            placeholder="Mínimo"
            value={filters.minPrice}
            onChange={(event) => onField('minPrice', event.target.value)}
            aria-label="Precio mínimo"
          />
          <span>–</span>
          <input
            inputMode="numeric"
            placeholder="Máximo"
            value={filters.maxPrice}
            onChange={(event) => onField('maxPrice', event.target.value)}
            aria-label="Precio máximo"
          />
        </div>
        {bounds.max > 0 && (
          <small className={styles.hint}>
            Entre {formatCOP(bounds.min)} y {formatCOP(bounds.max)}
          </small>
        )}
      </fieldset>

      <div className={styles.footer}>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(event) => onField('onlyAvailable', event.target.checked)}
          />
          Solo con existencias
        </label>
        {activeCount > 0 && (
          <button type="button" className={styles.reset} onClick={onReset}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  </section>
);

export default FilterPanel;
