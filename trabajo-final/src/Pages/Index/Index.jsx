import TopSellers from '../../Components/Index/TopSellers';
import LeagueGrid from '../../Components/Index/LeagueGrid';
import StoreDistance from '../../Components/Index/StoreDistance';
import Loader from '../../Components/Shared/Loader';
import Message from '../../Components/Shared/Message';
import { useCatalog } from '../../Hooks/useCatalog';
import { useTopSellers } from '../../Hooks/useTopSellers';
import { useLeagueTiles } from '../../Hooks/useLeagueTiles';
import styles from './Index.module.scss';

const Index = () => {
  const { loading, error } = useCatalog();
  const topSellers = useTopSellers();
  const leagues = useLeagueTiles();

  return (
    <div className={styles.page}>
      {loading && <Loader />}
      <Message type="error">{error}</Message>
      {!loading && !error && (
        <>
          <TopSellers products={topSellers} />
          <LeagueGrid leagues={leagues} />
        </>
      )}
      <StoreDistance />
    </div>
  );
};

export default Index;
