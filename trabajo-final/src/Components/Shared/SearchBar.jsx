import { Link } from 'react-router-dom';
import { toTitleCase } from '../../Helpers/formatters';
import styles from './SearchBar.module.scss';

const SearchBar = ({ query, onQueryChange, results = [], onSelect }) => (
  <div className={styles.searchBar}>
    <input
      type="search"
      placeholder="Busca tu equipo o camiseta…"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />

    {query.trim() && (
      <ul className={styles.results}>
        {results.length === 0 && <li className={styles.empty}>Sin resultados</li>}
        {results.map((product) => (
          <li key={product.id}>
            <Link to={`/producto/${product.id}`} className={styles.result} onClick={onSelect}>
              <span className={styles.team}>{toTitleCase(product.team)}</span>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SearchBar;
