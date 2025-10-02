/**
 * Utilidades de formateo para la aplicación
 */

/**
 * Formatea la duración de minutos a formato "Xh Ym"
 * @param minutos - Duración en minutos
 * @returns String formateado como "2h 30m"
 */
export const formatDuration = (minutos: number): string => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

/**
 * Formatea una fecha a formato legible
 * @param dateString - Fecha en formato string
 * @returns Fecha formateada
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formatea un precio a formato de moneda
 * @param precio - Precio numérico
 * @param currency - Símbolo de moneda (por defecto 'S/')
 * @returns Precio formateado como "S/ 15.50"
 */
export const formatPrice = (precio: number, currency: string = 'S/'): string => {
  return `${currency} ${precio.toFixed(2)}`;
};

/**
 * Trunca un texto a una longitud específica
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..." si es necesario
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
