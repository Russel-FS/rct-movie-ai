/**
 * Utilidades para manejo de objetos
 */

/**
 * Limpia un objeto eliminando propiedades con valores vacíos, null o undefined
 * @param obj Objeto a limpiar
 * @returns Nuevo objeto sin propiedades vacías
 */
export function limpiarObjetoVacio<T extends Record<string, any>>(obj: T): Partial<T> {
  const objetoLimpio = { ...obj };

  Object.keys(objetoLimpio).forEach((key) => {
    const value = objetoLimpio[key];
    if (value === '' || value === null || value === undefined) {
      delete objetoLimpio[key];
    }
  });

  return objetoLimpio;
}

/**
 * Limpia un objeto eliminando solo strings vacíos (mantiene null y undefined)
 * @param obj Objeto a limpiar
 * @returns Nuevo objeto sin strings vacíos
 */
export function limpiarStringsVacios<T extends Record<string, any>>(obj: T): T {
  const objetoLimpio = { ...obj };

  Object.keys(objetoLimpio).forEach((key) => {
    const value = objetoLimpio[key];
    if (value === '') {
      delete objetoLimpio[key];
    }
  });

  return objetoLimpio;
}
