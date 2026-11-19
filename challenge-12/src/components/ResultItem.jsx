function ResultItem({ product, prefixLength }) {
  return (
    <li className="result-item">
      <span className="name">
        <strong>{product.name.slice(0, prefixLength)}</strong>
        {product.name.slice(prefixLength).toUpperCase()}
      </span>
      <div className="bar">
        <div className="fill" style={{ width: `${product.popularity}%` }} />
      </div>
      <span className="score">{product.popularity}</span>
    </li>
  );
}

export default ResultItem;