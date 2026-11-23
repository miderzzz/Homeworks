import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from './constants';

const LOWER = ['de', 'del', 'la', 'las', 'los', 'el', 'y'];
const UPPER = ['FC', 'CF', 'AC', 'SC', 'CD', 'AFC', 'PSG'];

const SPECIAL = { LALIGA: 'LaLiga' };

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export const toTitleCase = (text = '') =>
  SPECIAL[text.trim().toUpperCase()] ??
  text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => {
      if (UPPER.includes(word.toUpperCase())) return word.toUpperCase();
      if (i > 0 && LOWER.includes(word)) return word;
      return word.split('-').map(capitalize).join('-');
    })
    .join(' ');

export const normalizeName = (text = '') => text.trim().replace(/\s+/g, ' ').toUpperCase();

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value) =>
  new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export const formatKm = (km) =>
  km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toLocaleString('es-CO', { maximumFractionDigits: 1 })} km`;

export const formatMinutes = (min) => {
  const total = Math.round(min);
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
};

export const onlyDigits = (value = '') => value.replace(/\D/g, '');

export const splitPhone = (full = '') => {
  const digits = onlyDigits(full);
  const match = [...COUNTRY_CODES]
    .sort((a, b) => b.code.length - a.code.length)
    .find(({ code }) => digits.startsWith(code) && digits.length - code.length >= 7);
  if (match) return { code: match.code, number: digits.slice(match.code.length) };
  return { code: DEFAULT_COUNTRY_CODE, number: digits };
};

export const formatPhone = (full = '') => {
  const { code, number } = splitPhone(full);
  if (code === '57' && number.length === 10) {
    return `+57 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }
  return `+${code} ${number}`;
};

export const whatsappLink = (digits, text) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

export const formatTime = (value) =>
  new Intl.DateTimeFormat('es-CO', { timeStyle: 'short' }).format(new Date(value));

export const formatDiscount = (discount) =>
  discount.discount_type === 'porcentaje' ? `${discount.value}%` : formatCOP(discount.value);
