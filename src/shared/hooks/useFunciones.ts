import { useState, useEffect } from 'react';
import { FuncionService } from '~/shared/services/funcion.service';
import { Funcion } from '~/shared/types/funcion';

interface UseFuncionesOptions {
  peliculaId?: string;
  salaId?: number;
  cineId?: number;
  incluirInactivas?: boolean;
}

// Hook para cargar las funciones
export const useFunciones = (options: UseFuncionesOptions = {}) => {
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { peliculaId, salaId, cineId, incluirInactivas = false } = options;

  const loadFunciones = async () => {
    try {
      setLoading(true);
      setError(null);

      let funcionesData: Funcion[] = [];

      if (peliculaId) {
        funcionesData = await FuncionService.getFuncionesByPelicula(peliculaId, incluirInactivas);
      } else if (salaId) {
        funcionesData = await FuncionService.getFuncionesBySala(salaId, incluirInactivas);
      } else if (cineId) {
        funcionesData = await FuncionService.getFuncionesByCine(cineId, incluirInactivas);
      } else {
        funcionesData = await FuncionService.getAllFunciones(incluirInactivas);
      }

      setFunciones(funcionesData);
    } catch (err) {
      setError('Error al cargar las funciones');
      console.error('Error loading funciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshFunciones = async () => {
    await loadFunciones();
  };

  const buscarFunciones = async (termino: string) => {
    try {
      setLoading(true);
      setError(null);

      const funcionesData = await FuncionService.buscarFunciones(termino);
      setFunciones(funcionesData);
    } catch (err) {
      setError('Error al buscar funciones');
      console.error('Error searching funciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunciones();
  }, [peliculaId, salaId, cineId, incluirInactivas]);

  return {
    funciones,
    loading,
    error,
    refreshFunciones,
    buscarFunciones,
  };
};

// Hook específico para una función individual
export const useFuncion = (funcionId: string) => {
  const [funcion, setFuncion] = useState<Funcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFuncion = async () => {
    if (!funcionId) {
      setError('No se proporcionó un ID de función');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const funcionData = await FuncionService.getFuncionById(funcionId);
      setFuncion(funcionData);
    } catch (err) {
      console.error('Error al cargar función:', err);
      setError('Error al cargar la información de la función');
      setFuncion(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshFuncion = async () => {
    await loadFuncion();
  };

  useEffect(() => {
    if (funcionId) {
      loadFuncion();
    }
  }, [funcionId]);

  return {
    funcion,
    loading,
    error,
    refreshFuncion,
  };
};
