import { FuncionService } from './funcion.service';
import { calcularDistancia, formatearDistancia } from '../utils/location.utils';

export interface CineDisponible {
  id: number;
  nombre: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  distance?: string;
  funcionesDisponibles: number;
}

export class SeleccionLugarService {
  static async getCinesDisponiblesPorPelicula(peliculaId: string): Promise<CineDisponible[]> {
    try {
      const funciones = await FuncionService.getFuncionesByPelicula(peliculaId, false);

      const cinesMap = new Map<number, CineDisponible>();

      funciones.forEach((funcion) => {
        if (funcion.sala?.cine) {
          const cine = funcion.sala.cine;
          const cineId = cine.id;

          if (cinesMap.has(cineId)) {
            const cineExistente = cinesMap.get(cineId)!;
            cineExistente.funcionesDisponibles += 1;
          } else {
            cinesMap.set(cineId, {
              id: cine.id,
              nombre: cine.nombre,
              direccion: cine.direccion || '',
              latitud: (cine as any).latitud,
              longitud: (cine as any).longitud,
              funcionesDisponibles: 1,
            });
          }
        }
      });

      return Array.from(cinesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
    } catch (error) {
      console.error('Error al obtener cines disponibles:', error);
      throw new Error('No se pudieron cargar los cines disponibles para esta película');
    }
  }

  static async getCinesConDistancia(
    peliculaId: string,
    userLatitude?: number,
    userLongitude?: number
  ): Promise<CineDisponible[]> {
    const cines = await this.getCinesDisponiblesPorPelicula(peliculaId);

    if (userLatitude && userLongitude) {
      return cines
        .map((cine) => {
          if (cine.latitud && cine.longitud) {
            const distanceKm = calcularDistancia(
              userLatitude,
              userLongitude,
              cine.latitud,
              cine.longitud
            );
            return {
              ...cine,
              distance: formatearDistancia(distanceKm),
            };
          }
          return {
            ...cine,
            distance: 'Distancia no disponible',
          };
        })
        .sort((a, b) => {
          if (a.latitud && a.longitud && b.latitud && b.longitud && userLatitude && userLongitude) {
            const distA = calcularDistancia(userLatitude, userLongitude, a.latitud, a.longitud);
            const distB = calcularDistancia(userLatitude, userLongitude, b.latitud, b.longitud);
            return distA - distB;
          }
          return a.nombre.localeCompare(b.nombre);
        });
    }

    return cines.map((cine) => ({
      ...cine,
      distance: 'Ubicación no disponible',
    }));
  }
}
