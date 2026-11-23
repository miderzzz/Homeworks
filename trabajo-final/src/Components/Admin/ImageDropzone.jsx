import { useRef, useState } from 'react';
import { MAX_IMAGES, MAX_IMAGE_MB, IMAGE_TYPES } from '../../Helpers/constants';
import styles from './ImageDropzone.module.scss';

const ImageDropzone = ({ dropzone, error }) => {
  const { images, remaining, addFiles, addUrl, remove, makeMain } = dropzone;
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef(null);
  const full = remaining <= 0;

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!full) addFiles(event.dataTransfer.files);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    if (!full) setDragging(true);
  };

  const submitUrl = () => {
    if (addUrl(url)) setUrl('');
  };

  return (
    <fieldset className={styles.dropzone}>
      <legend>
        Imágenes de referencia ({images.length}/{MAX_IMAGES})
      </legend>

      <div
        className={`${styles.area} ${dragging ? styles.dragging : ''} ${full ? styles.full : ''}`}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !full && inputRef.current?.click()}
        onKeyDown={(event) => event.key === 'Enter' && !full && inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {full ? (
          <p>Ya tienes las {MAX_IMAGES} imágenes permitidas. Quita una para agregar otra.</p>
        ) : (
          <>
            <p>
              <strong>Arrastra las imágenes aquí</strong> o haz clic para elegirlas
            </p>
            <p className={styles.hint}>
              JPG, PNG o WEBP · máximo {MAX_IMAGE_MB} MB cada una · te quedan {remaining}
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          multiple
          hidden
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      <div className={styles.urlRow}>
        <input
          type="url"
          placeholder="O pega la URL de una imagen (https://…)"
          value={url}
          disabled={full}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submitUrl();
            }
          }}
        />
        <button type="button" onClick={submitUrl} disabled={full || !url.trim()}>
          Agregar URL
        </button>
      </div>

      {(dropzone.error || error) && (
        <p className={styles.error} data-error={Boolean(error)}>
          {dropzone.error || error}
        </p>
      )}

      {images.length > 0 && (
        <ul className={styles.previews}>
          {images.map((image, index) => (
            <li key={image.key} className={index === 0 ? `${styles.preview} ${styles.main}` : styles.preview}>
              <img src={image.url} alt={`Imagen ${index + 1}`} />
              <span className={styles.badge}>
                {index === 0 ? 'Principal' : image.kind === 'url' ? 'URL' : image.kind === 'file' ? 'Local' : 'Guardada'}
              </span>
              <div className={styles.actions}>
                {index > 0 && (
                  <button type="button" onClick={() => makeMain(image.key)}>
                    Principal
                  </button>
                )}
                <button type="button" className={styles.remove} onClick={() => remove(image.key)}>
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
};

export default ImageDropzone;
