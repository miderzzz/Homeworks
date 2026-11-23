import { Link, useParams } from 'react-router-dom';
import ImageGallery from '../../Components/ProductDetail/ImageGallery';
import SizeSelector from '../../Components/ProductDetail/SizeSelector';
import Loader from '../../Components/Shared/Loader';
import Message from '../../Components/Shared/Message';
import { useProduct } from '../../Hooks/useProduct';
import { formatCOP, toTitleCase } from '../../Helpers/formatters';
import { KIT_FORMATS, KIT_TYPES, SLEEVE_TYPES, labelOf } from '../../Helpers/constants';
import styles from './ProductDetail.module.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const {
    product,
    loading,
    variant,
    quantity,
    setQuantity,
    available,
    soldOut,
    added,
    selectSize,
    add,
  } = useProduct(id);

  if (loading) return <Loader />;
  if (!product) {
    return (
      <Message type="error">
        No encontramos este uniforme. <Link to="/catalogo">Volver al catálogo</Link>
      </Message>
    );
  }

  return (
    <div className={styles.page}>
      <ImageGallery images={product.images} alt={product.name} />

      <section className={styles.info}>
        <Link to={`/catalogo/${product.league_slug}/${product.team_slug}`} className={styles.team}>
          {toTitleCase(product.team)} · {toTitleCase(product.league)}
        </Link>
        <h1 className={styles.name}>{product.name}</h1>
        <p className={styles.meta}>
          {labelOf(KIT_TYPES, product.kit_type)} · {labelOf(SLEEVE_TYPES, product.sleeve_type)} ·{' '}
          {labelOf(KIT_FORMATS, product.kit_format)}
          {product.season && ` · Temporada ${product.season}`}
        </p>
        <p className={styles.price}>{formatCOP(product.price)}</p>
        {product.description && <p>{product.description}</p>}

        {soldOut ? (
          <Message type="error">Este uniforme está agotado</Message>
        ) : (
          <>
            <h3>Talla</h3>
            <SizeSelector variants={product.variants} selectedId={variant?.id} onSelect={selectSize} />

            {variant && (
              <p className={styles.stock}>
                {available > 0 ? `${available} disponibles` : 'Ya tienes en el carrito todas las unidades de esta talla'}
              </p>
            )}

            <div className={styles.actions}>
              <input
                type="number"
                min="1"
                max={available || 1}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                disabled={!variant || available === 0}
                className={styles.quantity}
                aria-label="Cantidad"
              />
              <button type="button" onClick={add} disabled={!variant || available === 0}>
                {variant ? 'Agregar al carrito' : 'Elige una talla'}
              </button>
            </div>

            {added && (
              <Message type="success">
                Agregado al carrito. <Link to="/carrito">Ver carrito</Link>
              </Message>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
