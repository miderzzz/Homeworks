import { useState } from 'react';
import styles from './ImageGallery.module.scss';

const ImageGallery = ({ images, alt }) => {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  if (!current) return <div className={styles.placeholder}>Sin imagen</div>;

  return (
    <div className={styles.gallery}>
      <img className={styles.main} src={current.url} alt={alt} />
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={image.id ?? image.url}
              type="button"
              className={index === selected ? `${styles.thumb} ${styles.selected}` : styles.thumb}
              onClick={() => setSelected(index)}
            >
              <img src={image.url} alt={`${alt} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
