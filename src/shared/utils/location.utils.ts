/**
 * Utilidades para manejo de geolocalización
 */

export interface LocationCoords {
  lat: number;
  lon: number;
}

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
 * @param lat1 Latitud del primer punto
 * @param lon1 Longitud del primer punto
 * @param lat2 Latitud del segundo punto
 * @param lon2 Longitud del segundo punto
 * @returns Distancia en kilómetros
 */
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formatea la distancia para mostrar en la UI
 * @param distanceKm Distancia en kilómetros
 * @returns String formateado para mostrar
 */
export function formatearDistancia(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Obtiene la ubicación del usuario (placeholder para implementación futura)
 * TODO: Implementar con expo-location cuando sea necesario
 */
export async function obtenerUbicacionUsuario(): Promise<LocationCoords | null> {
  try {
    console.warn('falta implementar');
    return null;
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    return null;
  }
}
