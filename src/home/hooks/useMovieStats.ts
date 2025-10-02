import { useState, useEffect } from 'react';
import { PeliculaService } from '../services/pelicula.service';
import { GeneroService } from '../services/genero.service';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';

interface MovieStats {
  totalPeliculas: number;
  peliculasEstreno: number;
  peliculasDestacadas: number;
  promedioCalificacion: number;
  generoMasPopular: string;
}

interface UseMovieStatsReturn {
  stats: MovieStats;
  generos: GeneroMovie[];
  peliculasPorGenero: Record<number, Pelicula[]>;
  loading: boolean;
  error: string | null;
}

export const useMovieStats = (): UseMovieStatsReturn => {
  const [stats, setStats] = useState<MovieStats>({
    totalPeliculas: 0,
    peliculasEstreno: 0,
    peliculasDestacadas: 0,
    promedioCalificacion: 0,
    generoMasPopular: '',
  });
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [peliculasPorGenero, setPeliculasPorGenero] = useState<Record<number, Pelicula[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [peliculas, generosData] = await Promise.all([
          PeliculaService.getPeliculas(),
          GeneroService.getGeneros(),
        ]);

        // Calcular estadísticas
        const totalPeliculas = peliculas.length;
        const peliculasDestacadas = peliculas.filter((p) => p.destacada).length;
        const peliculasEstreno = peliculas.filter((p) => {
          if (!p.fecha_estreno) return false;
          const estreno = new Date(p.fecha_estreno);
          const hoy = new Date();
          const treintaDiasAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
          return estreno >= treintaDiasAtras;
        }).length;

        const calificaciones = peliculas
          .filter((p) => p.calificacion && p.calificacion > 0)
          .map((p) => p.calificacion!);
        const promedioCalificacion =
          calificaciones.length > 0
            ? calificaciones.reduce((sum, cal) => sum + cal, 0) / calificaciones.length
            : 0;

        // Cargar películas por género
        const peliculasPorGeneroMap: Record<number, Pelicula[]> = {};
        for (const genero of generosData) {
          try {
            const peliculasGenero = await PeliculaService.getPeliculasPorGenero(genero.id);
            peliculasPorGeneroMap[genero.id] = peliculasGenero.slice(0, 6); // Limitar a 6 por género
          } catch (err) {
            console.warn(`Error cargando películas del género ${genero.nombre}:`, err);
            peliculasPorGeneroMap[genero.id] = [];
          }
        }

        // Encontrar género más popular
        const generoMasPopular =
          generosData.reduce((prev, current) => {
            const prevCount = peliculasPorGeneroMap[prev.id]?.length || 0;
            const currentCount = peliculasPorGeneroMap[current.id]?.length || 0;
            return currentCount > prevCount ? current : prev;
          }, generosData[0])?.nombre || '';

        setStats({
          totalPeliculas,
          peliculasEstreno,
          peliculasDestacadas,
          promedioCalificacion,
          generoMasPopular,
        });
        setGeneros(generosData);
        setPeliculasPorGenero(peliculasPorGeneroMap);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    generos,
    peliculasPorGenero,
    loading,
    error,
  };
};
