import { useState, useEffect } from 'react';
import { PeliculaService } from '~/home/services/pelicula.service';
import { GeneroService } from '~/home/services/genero.service';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';

interface UsePeliculasOptions {
  cargarGeneros?: boolean;
  filtroGenero?: number;
  soloDestacadas?: boolean;
  soloEstrenos?: boolean;
}

// Hook para cargar las películas
export const usePeliculas = (options: UsePeliculasOptions = {}) => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [peliculasDestacadas, setPeliculasDestacadas] = useState<Pelicula[]>([]);
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    cargarGeneros = false,
    filtroGenero,
    soloDestacadas = false,
    soloEstrenos = false,
  } = options;

  const loadPeliculas = async () => {
    try {
      setLoading(true);
      setError(null);

      let peliculasData: Pelicula[] = [];

      if (soloDestacadas) {
        peliculasData = await PeliculaService.getPeliculasDestacadas();
      } else if (soloEstrenos) {
        peliculasData = await PeliculaService.getPeliculasEstreno();
      } else if (filtroGenero) {
        peliculasData = await PeliculaService.getPeliculasPorGenero(filtroGenero);
      } else {
        peliculasData = await PeliculaService.getPeliculas();
      }

      setPeliculas(peliculasData);

      const destacadas = peliculasData.filter((p) => p.destacada);
      setPeliculasDestacadas(destacadas);

      if (cargarGeneros) {
        const generosData = await GeneroService.getGeneros();
        setGeneros(generosData);
      }
    } catch (err) {
      setError('Error al cargar las películas');
      console.error('Error loading peliculas:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshPeliculas = async () => {
    await loadPeliculas();
  };

  const buscarPeliculas = async (termino: string) => {
    try {
      setLoading(true);
      setError(null);

      const peliculasData = await PeliculaService.buscarPeliculas(termino);
      setPeliculas(peliculasData);
    } catch (err) {
      setError('Error al buscar películas');
      console.error('Error searching peliculas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeliculas();
  }, [filtroGenero, soloDestacadas, soloEstrenos, cargarGeneros]);

  return {
    peliculas,
    peliculasDestacadas,
    generos,
    loading,
    error,
    refreshPeliculas,
    buscarPeliculas,
  };
};

// Hook específico para una película individual
export const usePelicula = (peliculaId: string) => {
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPelicula = async () => {
    if (!peliculaId) {
      setError('No se proporcionó un ID de película');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { pelicula: peliculaData, generos: generosData } =
        await PeliculaService.getPeliculaConGeneros(peliculaId);
      setPelicula(peliculaData);
      setGeneros(generosData);
    } catch (err) {
      console.error('Error al cargar película:', err);
      setError('Error al cargar la información de la película');
      setPelicula(null);
      setGeneros([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshPelicula = async () => {
    await loadPelicula();
  };

  useEffect(() => {
    if (peliculaId) {
      loadPelicula();
    }
  }, [peliculaId]);

  return {
    pelicula,
    generos,
    loading,
    error,
    refreshPelicula,
  };
};
