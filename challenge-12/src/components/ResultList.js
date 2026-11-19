import ResultItem from './ResultItem';

function ResultList({ results, prefixLength }) {
  if (results.length === 0) {
    return <p className="empty">No products found</p>;
  }

  return (
    <ol className="results">
      {results.map(product => (
        <ResultItem key={product.name} product={product} prefixLength={prefixLength} />
      ))}
    </ol>
  );
}

export default ResultList;