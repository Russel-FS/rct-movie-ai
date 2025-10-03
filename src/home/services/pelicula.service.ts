import {
  Pelicula,
  CreatePeliculaDto,
  UpdatePeliculaDto,
  PeliculaGenero,
} from '~/shared/types/pelicula';
import { HttpClient } from '../../shared/lib/useHttpClient';
import { MOVIE_CONFIG } from '~/shared/constants/app.constants';
import { limpiarObjetoVacio } from '~/shared/utils/object.utils';

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
   * Obtiene películas de estreno - trae los ultimos 30 dias
   */
  static async getPeliculasEstreno(): Promise<Pelicula[]> {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - MOVIE_CONFIG.ESTRENO_DAYS_LIMIT);
      const fechaISO = fechaLimite.toISOString().split('T')[0];

      const response = await HttpClient.get<Pelicula[]>(
        `/peliculas?fecha_estreno=gte.${fechaISO}&activa=eq.true&order=fecha_estreno.desc`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener películas de estreno:', error);
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
   * Obtiene una película por ID junto con sus géneros
   */
  static async getPeliculaConGeneros(
    id: string
  ): Promise<{ pelicula: Pelicula; generos: import('~/shared/types/genero').GeneroMovie[] }> {
    try {
      const pelicula = await this.getPeliculaById(id);

      const generosIds = await this.getGenerosPelicula(id);

      const { GeneroService } = await import('./genero.service');
      const generos = await GeneroService.getGenerosByIds(generosIds);

      return { pelicula, generos };
    } catch (error) {
      console.error('Error al obtener película con géneros:', error);
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

  /**
   * Crea una nueva película
   */
  static async agregarPelicula(peliculaData: CreatePeliculaDto): Promise<Pelicula> {
    try {
      // Extraer generos_ids del objeto principal
      const { generos_ids, ...peliculaSinGeneros } = peliculaData;

      // Validar datos obligatorios
      if (!peliculaSinGeneros.titulo || peliculaSinGeneros.titulo.trim() === '') {
        throw new Error('El título es obligatorio');
      }

      if (!peliculaSinGeneros.duracion || peliculaSinGeneros.duracion <= 0) {
        throw new Error('La duración debe ser mayor a 0');
      }

      if (!peliculaSinGeneros.clasificacion) {
        throw new Error('La clasificación es obligatoria');
      }

      const peliculaLimpia = limpiarObjetoVacio(peliculaSinGeneros);

      const peliculaCompleta = {
        ...peliculaLimpia,
        activa: true,
        destacada: false,
        votos: 0,
        calificacion: null,
      };

      const response = await HttpClient.post<Pelicula[]>('/peliculas', peliculaCompleta, {
        headers: {
          Prefer: 'return=representation',
        },
      });

      const peliculaCreada = response.data[0];

      if (generos_ids && generos_ids.length > 0) {
        await this.asignarGenerosPelicula(peliculaCreada.id, generos_ids);
      }

      return peliculaCreada;
    } catch (error: any) {
      console.error('Error al crear película:', error);
      console.error('Detalles del error:', JSON.stringify(error.response?.data, null, 2));
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      console.error('URL:', error.config?.url);
      throw error;
    }
  }

  /**
   * Actualiza una película existente
   */
  static async modificarPelicula(id: string, peliculaData: UpdatePeliculaDto): Promise<Pelicula> {
    try {
      // Extraer generos_ids del objeto principal
      const { generos_ids, ...peliculaSinGeneros } = peliculaData;

      // Limpiar campos vacíos
      const peliculaLimpia = limpiarObjetoVacio(peliculaSinGeneros);

      // Actualizar la película
      const response = await HttpClient.patch<Pelicula[]>(
        `/peliculas?id=eq.${id}`,
        peliculaLimpia,
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error('Película no encontrada para actualizar');
      }

      const peliculaActualizada = response.data[0];

      // Si se proporcionaron géneros, actualizar las relaciones
      if (generos_ids !== undefined) {
        // Eliminar géneros existentes
        await HttpClient.delete(`/pelicula_generos?pelicula_id=eq.${id}`);

        // Agregar nuevos géneros
        if (generos_ids.length > 0) {
          await this.asignarGenerosPelicula(id, generos_ids);
        }
      }

      return peliculaActualizada;
    } catch (error) {
      console.error('Error al actualizar película:', error);
      throw error;
    }
  }

  /**
   * Cambia el estado activo de una película (soft delete)
   */
  static async actualizarEstadoPelicula(id: string, activa: boolean): Promise<Pelicula> {
    try {
      const response = await HttpClient.patch<Pelicula[]>(
        `/peliculas?id=eq.${id}`,
        { activa },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error('Película no encontrada para actualizar estado');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al actualizar estado de película:', error);
      throw error;
    }
  }

  /**
   * "Elimina" una película (desactivándola)
   */
  static async eliminarPelicula(id: string): Promise<void> {
    try {
      await this.actualizarEstadoPelicula(id, false);
    } catch (error) {
      console.error('Error al eliminar película:', error);
      throw error;
    }
  }

  /**
   * Reactiva una película
   */
  static async reactivarPelicula(id: string): Promise<Pelicula> {
    try {
      return await this.actualizarEstadoPelicula(id, true);
    } catch (error) {
      console.error('Error al reactivar película:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado destacado de una película
   */
  static async actualizarDestacado(id: string, destacada: boolean): Promise<Pelicula> {
    try {
      const response = await HttpClient.patch<Pelicula[]>(
        `/peliculas?id=eq.${id}`,
        { destacada },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error('Película no encontrada para actualizar destacado');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al actualizar destacado de película:', error);
      throw error;
    }
  }

  /**
   * Método auxiliar para asignar géneros a una película
   */
  private static async asignarGenerosPelicula(
    peliculaId: string,
    generosIds: number[]
  ): Promise<void> {
    try {
      const relacionesGeneros: PeliculaGenero[] = generosIds.map((generoId) => ({
        pelicula_id: peliculaId,
        genero_id: generoId,
      }));

      await HttpClient.post('/pelicula_generos', relacionesGeneros);
    } catch (error) {
      console.error('Error al asignar géneros a película:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los géneros de una película
   */
  static async getGenerosPelicula(peliculaId: string): Promise<number[]> {
    try {
      const response = await HttpClient.get<PeliculaGenero[]>(
        `/pelicula_generos?pelicula_id=eq.${peliculaId}`
      );
      return response.data.map((relacion) => relacion.genero_id);
    } catch (error) {
      console.error('Error al obtener géneros de película:', error);
      throw error;
    }
  }

  /**
   * Actualiza la calificación de una película
   */
  static async actualizarCalificacion(id: string, calificacion: number): Promise<Pelicula> {
    try {
      // Obtener la película actual para incrementar votos
      const peliculaActual = await this.getPeliculaById(id);
      const nuevosVotos = peliculaActual.votos + 1;

      const response = await HttpClient.patch<Pelicula[]>(
        `/peliculas?id=eq.${id}`,
        {
          calificacion,
          votos: nuevosVotos,
        },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (response.data.length === 0) {
        throw new Error('Película no encontrada para actualizar calificación');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al actualizar calificación de película:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las películas (incluyendo inactivas) - útil para administración
   */
  static async getAllPeliculas(): Promise<Pelicula[]> {
    try {
      const response = await HttpClient.get<Pelicula[]>('/peliculas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las películas:', error);
      throw error;
    }
  }
}
