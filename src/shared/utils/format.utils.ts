/**
 * Formatea la duración de una película en horas y minutos
 * @param minutos Duración en minutos
 * @returns String formateado (ej: "2h 30min")
 */
export function formatearDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}min`;
}

/**
 * Formatea una fecha para mostrar en la UI
 * @param dateString Fecha en formato string
 * @param locale Locale para el formateo (por defecto 'es-ES')
 * @returns Fecha formateada
 */
export function formatearFecha(dateString?: string, locale: string = 'es-ES'): string {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
}

/**
 * Formatea una calificación para mostrar con decimales
 * @param calificacion Calificación numérica
 * @param decimales Número de decimales (por defecto 1)
 * @returns Calificación formateada
 */
export function formatearCalificacion(calificacion?: number, decimales: number = 1): string {
  if (calificacion === null || calificacion === undefined) return 'N/A';
  return calificacion.toFixed(decimales);
}

/**
 * Trunca un texto a una longitud específica
 * @param texto Texto a truncar
 * @param longitud Longitud máxima
 * @param sufijo Sufijo a agregar (por defecto '...')
 * @returns Texto truncado
 */
export function truncarTexto(texto: string, longitud: number, sufijo: string = '...'): string {
  if (texto.length <= longitud) return texto;
  return texto.substring(0, longitud - sufijo.length) + sufijo;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param texto Texto a capitalizar
 * @returns Texto capitalizado
 */
export function capitalizarTexto(texto: string): string {
  return texto.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
