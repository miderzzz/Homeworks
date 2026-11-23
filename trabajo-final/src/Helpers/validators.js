import { IMAGE_TYPES, MAX_IMAGE_MB } from './constants';

export const isEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());

export const isPhoneNumber = (value) => /^\d{7,12}$/.test(value.replace(/\D/g, ''));

export const isUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const imageFileError = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return `${file.name}: solo se permiten JPG, PNG o WEBP`;
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `${file.name}: pesa más de ${MAX_IMAGE_MB} MB`;
  return null;
};

export const discountCodeError = (code) =>
  /^[A-Z0-9_-]{3,20}$/.test(code)
    ? null
    : 'El código debe tener de 3 a 20 caracteres: letras, números, guion o guion bajo';
