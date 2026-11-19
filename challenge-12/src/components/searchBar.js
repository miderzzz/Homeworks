const K_OPTIONS = [1, 2, 3, 5, 10];

function SearchBar({ query, onQueryChange, k, onKChange }) {
  return (
    <div className="controls">
      <input className="search-input"
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      <label className="select-label">
        Top
        <select className="select" value={k} onChange={e => onKChange(Number(e.target.value))}>
          {K_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SearchBar;