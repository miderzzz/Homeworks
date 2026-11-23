import { Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../Components/Shared/Sidebar';
import SearchBar from '../../Components/Shared/SearchBar';
import ProductGrid from '../../Components/Shared/ProductGrid';
import Loader from '../../Components/Shared/Loader';
import Message from '../../Components/Shared/Message';
import { useCatalog } from '../../Hooks/useCatalog';
import { useCatalogFilter } from '../../Hooks/useCatalogFilter';
import { useSearch } from '../../Hooks/useSearch';
import styles from './Catalog.module.scss';

const Catalog = () => {
  const params = useParams();
  const location = useLocation();
  const { tree, loading, error } = useCatalog();
  const { products, breadcrumb } = useCatalogFilter(params);
  const search = useSearch();

  return (
    <div className={styles.page}>
      <Sidebar tree={tree} activePath={location.pathname} />

      <section className={styles.content}>
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            {breadcrumb.map((node, index) => (
              <span key={node.id}>
                {index > 0 && ' / '}
                <Link to={node.path}>{node.label}</Link>
              </span>
            ))}
          </nav>
          <SearchBar
            query={search.query}
            onQueryChange={search.setQuery}
            results={search.results}
            onSelect={search.clear}
          />
        </header>

        {loading && <Loader />}
        <Message type="error">{error}</Message>
        {!loading && !error && <ProductGrid products={products} />}
      </section>
    </div>
  );
};

export default Catalog;
