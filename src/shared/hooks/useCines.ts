import { useState, useEffect } from 'react';
import { CineService } from '../services/cine.service';
import { Cine } from '../types/cine';
import { useLocation } from './useLocation';
import { LocationCoords } from '../utils/location.utils';

interface UseCinesOptions {
  incluirUbicacion?: boolean;
  radio?: number;
}

export const useCines = (options: UseCinesOptions = {}) => {
  const [cines, setCines] = useState<Cine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { incluirUbicacion = true, radio = 10 } = options;

  // Usar el hook de ubicación
  const { location, requestLocation, hasPermission } = useLocation();

  const loadCines = async () => {
    try {
      setLoading(true);
      setError(null);

      const userLat = location?.lat;
      const userLon = location?.lon;
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

  const refreshCines = async () => {
    if (incluirUbicacion && !location) {
      await requestLocation();
    }
    await loadCines();
  };

  const buscarCines = async (termino: string) => {
    try {
      setLoading(true);
      setError(null);

      const cinesData = await CineService.buscarCines(termino, location?.lat, location?.lon);
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
      return await CineService.getCineById(id, location?.lat, location?.lon);
    } catch (err) {
      console.error('Error getting cine by id:', err);
      return null;
    }
  };

  // Solicitar ubicación al montar si se requiere
  useEffect(() => {
    if (incluirUbicacion && !hasPermission) {
      requestLocation();
    }
  }, [incluirUbicacion]);

  // Cargar cines cuando cambie la ubicación o las opciones
  useEffect(() => {
    loadCines();
  }, [location, incluirUbicacion, radio]);

  return {
    cines,
    loading,
    error,
    userLocation: location,
    hasPermission,
    requestLocation,
    refreshCines,
    buscarCines,
    getCineById,
  };
};
