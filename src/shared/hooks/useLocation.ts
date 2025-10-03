import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { LocationCoords } from '../utils/location.utils';
import * as Location from 'expo-location';

interface UseLocationReturn {
  location: LocationCoords | null;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestLocation: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Verificar permisos al montar el componente
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (err) {
      console.error('Error verificando permisos:', err);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);

      if (!granted) {
        Alert.alert(
          'Permisos de Ubicación',
          'Para mostrar cines cercanos, necesitamos acceso a tu ubicación. Puedes habilitarlo en la configuración de la app.',
          [{ text: 'Entendido' }]
        );
      }

      return granted;
    } catch (err) {
      setError('Error solicitando permisos de ubicación');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si tenemos permisos
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      // Obtener ubicación
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: LocationCoords = {
        lat: locationResult.coords.latitude,
        lon: locationResult.coords.longitude,
      };

      setLocation(userLocation);
    } catch (err) {
      setError('Error obteniendo ubicación');
      Alert.alert('Error', 'Ocurrió un error al obtener tu ubicación. Inténtalo de nuevo.', [
        { text: 'Entendido' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    hasPermission,
    requestLocation,
    requestPermission,
  };
}
