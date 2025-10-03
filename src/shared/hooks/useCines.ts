import { useState, useEffect } from 'react';
import { CineService } from '../services/cine.service';
import { Cine } from '../types/cine';
import { obtenerUbicacionUsuario, LocationCoords } from '../utils/location.utils';

interface UseCinesOptions {
  incluirUbicacion?: boolean;
  radio?: number;
}

export const useCines = (options: UseCinesOptions = {}) => {
  const [cines, setCines] = useState<Cine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);

  const { incluirUbicacion = false, radio = 10 } = options;

  const loadCines = async (userLat?: number, userLon?: number) => {
    try {
      setLoading(true);
      setError(null);

      let cinesData: Cine[];

      if (userLat && userLon && radio) {
        cinesData = await CineService.getCinesCercanos(userLat, userLon, radio);
      } else {
        cinesData = await CineService.getCines(userLat, userLon);
      }

      setCines(cinesData);
    } catch (err) {
      setError('Error al cargar los cines');
      console.error('Error loading cines:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async (): Promise<LocationCoords | null> => {
    try {
      const location = await obtenerUbicacionUsuario();
      if (location) {
        setUserLocation(location);
      }
      return location;
    } catch (error) {
      console.warn('Error obteniendo ubicación:', error);
      return null;
    }
  };

  const refreshCines = async () => {
    if (incluirUbicacion) {
      const location = await getUserLocation();
      await loadCines(location?.lat, location?.lon);
    } else {
      await loadCines();
    }
  };

  const buscarCines = async (termino: string) => {
    try {
      setLoading(true);
      setError(null);

      const cinesData = await CineService.buscarCines(
        termino,
        userLocation?.lat,
        userLocation?.lon
      );
      setCines(cinesData);
    } catch (err) {
      setError('Error al buscar cines');
      console.error('Error searching cines:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCineById = async (id: number): Promise<Cine | null> => {
    try {
      return await CineService.getCineById(id, userLocation?.lat, userLocation?.lon);
    } catch (err) {
      console.error('Error getting cine by id:', err);
      return null;
    }
  };

  useEffect(() => {
    refreshCines();
  }, [incluirUbicacion, radio]);

  return {
    cines,
    loading,
    error,
    userLocation,
    refreshCines,
    buscarCines,
    getCineById,
  };
};
