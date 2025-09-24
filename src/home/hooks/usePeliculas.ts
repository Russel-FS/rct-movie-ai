import { useState, useEffect, useCallback } from 'react';

import { PeliculaService } from '../services/pelicula.service';
import { Pelicula } from '~/shared/types/pelicula';

interface UsePeliculasState {
  peliculas: Pelicula[];
  peliculasDestacadas: Pelicula[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredPeliculas: Pelicula[];
}

interface UsePeliculasActions {
  refetch: () => Promise<void>;
  buscarPeliculas: (termino: string) => Promise<void>;
  setSearchTerm: (termino: string) => void;
  getPeliculaById: (id: string) => Promise<Pelicula | null>;
}

export const usePeliculas = (): UsePeliculasState & UsePeliculasActions => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [peliculasDestacadas, setPeliculasDestacadas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPeliculas, setFilteredPeliculas] = useState<Pelicula[]>([]);

  // Función para cargar todas las películas
  const fetchPeliculas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [todasPeliculas, destacadas] = await Promise.all([
        PeliculaService.getPeliculas(),
        PeliculaService.getPeliculasDestacadas(),
      ]);

      setPeliculas(todasPeliculas);
      setPeliculasDestacadas(destacadas);
      setFilteredPeliculas(todasPeliculas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar películas');
      console.error('Error en usePeliculas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para buscar películas
  const buscarPeliculas = useCallback(
    async (termino: string) => {
      if (!termino.trim()) {
        setFilteredPeliculas(peliculas);
        return;
      }

      try {
        setLoading(true);
        const resultados = await PeliculaService.buscarPeliculas(termino);
        setFilteredPeliculas(resultados);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar películas');
      } finally {
        setLoading(false);
      }
    },
    [peliculas]
  );

  // Función para obtener película por ID
  const getPeliculaById = useCallback(async (id: string): Promise<Pelicula | null> => {
    try {
      return await PeliculaService.getPeliculaById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener película');
      return null;
    }
  }, []);

  // Filtrar películas localmente cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPeliculas(peliculas);
    } else {
      const filtered = peliculas.filter(
        (pelicula) =>
          pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pelicula.titulo_original?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pelicula.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pelicula.reparto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPeliculas(filtered);
    }
  }, [searchTerm, peliculas]);

  // Cargar películas al montar el componente
  useEffect(() => {
    fetchPeliculas();
  }, [fetchPeliculas]);

  return {
    // Estado
    peliculas,
    peliculasDestacadas,
    loading,
    error,
    searchTerm,
    filteredPeliculas,

    // Acciones
    refetch: fetchPeliculas,
    buscarPeliculas,
    setSearchTerm,
    getPeliculaById,
  };
};
