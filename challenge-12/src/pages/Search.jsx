import { useMemo, useState } from 'react';
import { SearchEngine } from '../classes/SearchEngine';
import { products } from '../data/products';
import SearchBar from '../components/searchBar';
import ResultList from '../components/ResultList';
import ProductForm from '../components/ProductForm';

function Search() {
  const engine = useMemo(() => {
    const searchEngine = new SearchEngine();
    products.forEach(p => searchEngine.insert(p.name, p.popularity));
    return searchEngine;
  }, []);

  const [query, setQuery] = useState('');
  const [k, setK] = useState(3);
  const [total, setTotal] = useState(products.length);

  const handleAdd = (name, popularity) => {
    const exists = engine.trie.search(name);
    engine.insert(name, popularity);
    setTotal(engine.trie.searchByPrefix('').length);
    return exists;
  };

  const prefix = query.trim();
  const results = engine.searchTopK(prefix, k);

  return (
    <div className="app">
      <h1>Smart Search Engine</h1>
      <p className="hint">{total} products in the catalog</p>

      

      <SearchBar query={query} onQueryChange={setQuery} k={k} onKChange={setK} />

      <p className="hint">
        {prefix.length === 0
          ? `Top ${k} most popular products`
          : `Top ${k} results for "${prefix}"`}
      </p>

      <ResultList results={results} prefixLength={prefix.length} />
          <div className="form-container">
      <ProductForm onAdd={handleAdd} />
    </div>
    </div>

  );
}

export default Search;