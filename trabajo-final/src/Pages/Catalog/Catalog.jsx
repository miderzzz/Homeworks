import { Link, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../../Components/Shared/Sidebar';
import SearchBar from '../../Components/Shared/SearchBar';
import ProductGrid from '../../Components/Shared/ProductGrid';
import FilterPanel from '../../Components/Catalog/FilterPanel';
import Loader from '../../Components/Shared/Loader';
import Message from '../../Components/Shared/Message';
import { useCatalog } from '../../Hooks/useCatalog';
import { useCatalogFilter } from '../../Hooks/useCatalogFilter';
import { useSearch } from '../../Hooks/useSearch';
import { useProductFilters } from '../../Hooks/useProductFilters';
import styles from './Catalog.module.scss';

const Catalog = () => {
  const params = useParams();
  const location = useLocation();
  const { tree, loading, error } = useCatalog();
  const { products, breadcrumb } = useCatalogFilter(params);
  const search = useSearch();
  const filter = useProductFilters(products);

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
        {!loading && !error && (
          <>
            <FilterPanel
              filters={filter.filters}
              total={filter.results.length}
              bounds={filter.bounds}
              activeCount={filter.activeCount}
              open={filter.open}
              onToggleOpen={filter.toggleOpen}
              onToggle={filter.toggle}
              onField={filter.setField}
              onReset={filter.reset}
              hideKitType={Boolean(params.version)}
            />
            <ProductGrid
              products={filter.results}
              emptyText={filter.activeCount > 0 ? 'Ningún uniforme coincide con los filtros' : undefined}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Catalog;
