import { useEffect, useRef, useState } from 'react';
import { MAX_IMAGES } from '../Helpers/constants';
import { imageFileError, isUrl } from '../Helpers/validators';

const fromExisting = (images = []) =>
  images.map((image) => ({ key: `existing-${image.id}`, kind: 'existing', url: image.url, path: image.path }));

export const useImageDropzone = (initialImages = []) => {
  const [images, setImages] = useState(() => fromExisting(initialImages));
  const [error, setError] = useState('');
  const counter = useRef(0);
  const latest = useRef(images);

  useEffect(() => {
    latest.current = images;
  }, [images]);

  useEffect(
    () => () => {
      latest.current.forEach((image) => image.kind === 'file' && URL.revokeObjectURL(image.url));
    },
    [],
  );

  const nextKey = () => {
    counter.current += 1;
    return `new-${counter.current}`;
  };

  const remaining = MAX_IMAGES - images.length;

  const addFiles = (fileList) => {
    const problems = [];
    const accepted = [];

    Array.from(fileList).forEach((file) => {
      const problem = imageFileError(file);
      if (problem) problems.push(problem);
      else accepted.push(file);
    });

    if (accepted.length > remaining) {
      problems.push(`Solo puedes tener ${MAX_IMAGES} imágenes; se agregaron las primeras ${Math.max(remaining, 0)}`);
    }

    const added = accepted
      .slice(0, Math.max(remaining, 0))
      .map((file) => ({ key: nextKey(), kind: 'file', file, url: URL.createObjectURL(file) }));

    setImages((current) => [...current, ...added]);
    setError(problems.join('. '));
  };

  const addUrl = (rawUrl) => {
    const url = rawUrl.trim();
    if (!isUrl(url)) {
      setError('Escribe una URL válida que empiece por http:// o https://');
      return false;
    }
    if (remaining <= 0) {
      setError(`Ya tienes las ${MAX_IMAGES} imágenes permitidas`);
      return false;
    }
    if (images.some((image) => image.url === url)) {
      setError('Esa imagen ya está agregada');
      return false;
    }
    setImages((current) => [...current, { key: nextKey(), kind: 'url', url, path: null }]);
    setError('');
    return true;
  };

  const remove = (key) => {
    const target = images.find((image) => image.key === key);
    if (target?.kind === 'file') URL.revokeObjectURL(target.url);
    setImages((current) => current.filter((image) => image.key !== key));
    setError('');
  };

  const makeMain = (key) =>
    setImages((current) => {
      const target = current.find((image) => image.key === key);
      return target ? [target, ...current.filter((image) => image.key !== key)] : current;
    });

  const reset = (existing) => {
    setImages(fromExisting(existing));
    setError('');
  };

  return { images, error, remaining, addFiles, addUrl, remove, makeMain, reset };
};
