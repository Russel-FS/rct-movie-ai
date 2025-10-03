// Configuración de geolocalización
export const LOCATION_CONFIG = {
  DEFAULT_RADIUS_KM: 20,
  MAX_RADIUS_KM: 50,
  LOCATION_TIMEOUT: 10000,
  LOCATION_MAX_AGE: 300000,
} as const;

// Configuración de películas
export const MOVIE_CONFIG = {
  ESTRENO_DAYS_LIMIT: 30,
  DEFAULT_POSTER_URL: 'https://via.placeholder.com/800x600?text=Sin+Imagen',
} as const;

// Configuración de UI
export const UI_CONFIG = {
  LOADING_DELAY: 300,
  ANIMATION_DURATION: 200,
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  MOVIE_NOT_FOUND: 'No se pudo cargar la película',
  CINEMAS_NOT_FOUND: 'No hay cines disponibles',
  LOCATION_ERROR: 'No se pudo obtener tu ubicación',
  GENERIC_ERROR: 'Ocurrió un error inesperado',
} as const;
