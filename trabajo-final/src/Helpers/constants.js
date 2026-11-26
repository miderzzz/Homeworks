export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const KIT_TYPES = [
  { value: 'local', label: 'Primera (local)' },
  { value: 'visitante', label: 'Segunda (visitante)' },
  { value: 'alterno', label: 'Alterna' },
  { value: 'arquero', label: 'Arquero' },
];

export const SLEEVE_TYPES = [
  { value: 'corta', label: 'Manga corta' },
  { value: 'larga', label: 'Manga larga' },
];

export const KIT_FORMATS = [
  { value: 'camiseta', label: 'Solo camiseta' },
  { value: 'completo', label: 'Uniforme completo' },
];

export const DISCOUNT_TYPES = [
  { value: 'porcentaje', label: 'Porcentaje (%)' },
  { value: 'valor', label: 'Valor fijo ($)' },
];

export const ORDER_STATUS = {
  pendiente_pago: 'Pendiente de pago',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const BREB_KEY_TYPES = {
  celular: 'Celular',
  documento: 'Documento',
  correo: 'Correo',
  alfanumerica: 'Alfanumérica',
  comercio: 'Código de comercio',
};

export const UNDO_LIMIT = 20;
export const LOW_STOCK = 5;
export const COUNTRY_CODES = [
  { code: '57', country: 'Colombia' },
  { code: '58', country: 'Venezuela' },
  { code: '593', country: 'Ecuador' },
  { code: '51', country: 'Perú' },
  { code: '507', country: 'Panamá' },
  { code: '52', country: 'México' },
  { code: '1', country: 'Estados Unidos' },
  { code: '34', country: 'España' },
  { code: '54', country: 'Argentina' },
  { code: '56', country: 'Chile' },
  { code: '55', country: 'Brasil' },
];

export const DEFAULT_COUNTRY_CODE = '57';
export const MAX_IMAGES = 5;
export const MAX_IMAGE_MB = 2;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SEARCH_LIMIT = 5;
export const TOP_SELLERS_LIMIT = 4;
export const MAX_QUANTITY = 10;
export const CART_STORAGE_KEY = 'sport-champion-cart';
export const STORE_NAME = 'SPORT CHAMPION';

export const labelOf = (list, value) => list.find((item) => item.value === value)?.label ?? value;

export const STORE_LOCATION = {
  store_name: 'Sport Champion',
  store_address: 'Centro Comercial El Caleño, Local 527, Cali',
  store_lat: 3.4484950070242215,
  store_lng: -76.52987301349415,
};
export const ROUTE_REFRESH_METERS = 150;
export const CITY_SPEED_KMH = 25;
export const STORE_WHATSAPP = '573175190835';
