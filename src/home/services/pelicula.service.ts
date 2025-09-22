import { Pelicula } from '~/shared/types';
import { HttpClient } from '../../shared/lib/useHttpClient';

export class PeliculaService {
  /**
   * Obtiene todas las películas activas
   */
  static async getPeliculas(): Promise<Pelicula[]> {
    try {
      const response = await HttpClient.get<Pelicula[]>('/peliculas?activa=eq.true');
      return response.data;
    } catch (error) {
      console.error('Error al obtener películas:', error);
      throw error;
    }
  }

  /**
   * Obtiene películas destacadas
   */
  static async getPeliculasDestacadas(): Promise<Pelicula[]> {
    try {
      const response = await HttpClient.get<Pelicula[]>(
        '/peliculas?destacada=eq.true&activa=eq.true'
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener películas destacadas:', error);
      throw error;
    }
  }

  /**
   * Obtiene una película por ID
   */
  static async getPeliculaById(id: string): Promise<Pelicula> {
    try {
      const response = await HttpClient.get<Pelicula[]>(`/peliculas?id=eq.${id}`);
      if (response.data.length === 0) {
        throw new Error('Película no encontrada');
      }
      return response.data[0];
    } catch (error) {
      console.error('Error al obtener película:', error);
      throw error;
    }
  }

  /**
   * Busca películas por título
   */
  static async buscarPeliculas(termino: string): Promise<Pelicula[]> {
    try {
      const response = await HttpClient.get<Pelicula[]>(
        `/peliculas?titulo=ilike.*${termino}*&activa=eq.true`
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar películas:', error);
      throw error;
    }
  }

  /**
   * Obtiene películas por género
   */
  static async getPeliculasPorGenero(generoId: number): Promise<Pelicula[]> {
    try {
      // Usando la tabla de relación pelicula_generos
      const response = await HttpClient.get<any[]>(
        `/pelicula_generos?genero_id=eq.${generoId}&select=pelicula_id,peliculas(*)`
      );
      return response.data.map((item) => item.peliculas);
    } catch (error) {
      console.error('Error al obtener películas por género:', error);
      throw error;
    }
  }
}
