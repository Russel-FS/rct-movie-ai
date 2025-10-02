import { GeneroMovie, CreateGeneroDto, UpdateGeneroDto } from '~/shared/types/genero';
import { HttpClient } from '../../shared/lib/useHttpClient';

export class GeneroService {
  /**
   * Obtiene todos los géneros activos
   */
  static async getGeneros(): Promise<GeneroMovie[]> {
    try {
      const response = await HttpClient.get<GeneroMovie[]>('/generos?activo=eq.true');
      return response.data;
    } catch (error) {
      console.error('Error al obtener géneros:', error);
      throw error;
    }
  }

  /**
   * Obtiene un género por ID
   */
  static async getGeneroById(id: number): Promise<GeneroMovie> {
    try {
      const response = await HttpClient.get<GeneroMovie[]>(`/generos?id=eq.${id}`);
      if (response.data.length === 0) {
        throw new Error('Género no encontrado');
      }
      return response.data[0];
    } catch (error) {
      console.error('Error al obtener género:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo género
   */
  static async agregarGenero(generoData: CreateGeneroDto): Promise<GeneroMovie> {
    try {
      // Verificar si ya existe un género con el mismo nombre
      const generoExistente = await this.buscarGeneroPorNombre(generoData.nombre);
      if (generoExistente) {
        throw new Error('Ya existe un género con ese nombre');
      }

      // Preparar datos del género con valores por defecto
      const generoCompleto = {
        ...generoData,
        activo: true
      };

      const response = await HttpClient.post<GeneroMovie[]>(
        '/generos',
        generoCompleto,
        {
          headers: {
            'Prefer': 'return=representation'
          }
        }
      );

      if (response.data.length === 0) {
        throw new Error('Error al crear el género');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al crear género:', error);
      throw error;
    }
  }

  /**
   * Actualiza un género existente
   */
  static async modificarGenero(id: number, generoData: UpdateGeneroDto): Promise<GeneroMovie> {
    try {
      // Si se está actualizando el nombre, verificar que no exista otro género con ese nombre
      if (generoData.nombre) {
        const generoExistente = await this.buscarGeneroPorNombre(generoData.nombre);
        if (generoExistente && generoExistente.id !== id) {
          throw new Error('Ya existe otro género con ese nombre');
        }
      }

      const response = await HttpClient.patch<GeneroMovie[]>(
        `/generos?id=eq.${id}`,
        generoData,
        {
          headers: {
            'Prefer': 'return=representation'
          }
        }
      );

      if (response.data.length === 0) {
        throw new Error('Género no encontrado para actualizar');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al actualizar género:', error);
      throw error;
    }
  }

  /**
   * Cambia el estado activo de un género (soft delete)
   */
  static async actualizarEstadoGenero(id: number, activo: boolean): Promise<GeneroMovie> {
    try {
      const response = await HttpClient.patch<GeneroMovie[]>(
        `/generos?id=eq.${id}`,
        { activo },
        {
          headers: {
            'Prefer': 'return=representation'
          }
        }
      );

      if (response.data.length === 0) {
        throw new Error('Género no encontrado para actualizar estado');
      }

      return response.data[0];
    } catch (error) {
      console.error('Error al actualizar estado de género:', error);
      throw error;
    }
  }

  /**
   * "Elimina" un género (desactivándolo)
   */
  static async eliminarGenero(id: number): Promise<void> {
    try {
      await this.actualizarEstadoGenero(id, false);
    } catch (error) {
      console.error('Error al eliminar género:', error);
      throw error;
    }
  }

  /**
   * Reactiva un género
   */
  static async reactivarGenero(id: number): Promise<GeneroMovie> {
    try {
      return await this.actualizarEstadoGenero(id, true);
    } catch (error) {
      console.error('Error al reactivar género:', error);
      throw error;
    }
  }

  /**
   * Busca géneros por nombre (búsqueda parcial)
   */
  static async buscarGeneros(termino: string): Promise<GeneroMovie[]> {
    try {
      const response = await HttpClient.get<GeneroMovie[]>(
        `/generos?nombre=ilike.*${termino}*&activo=eq.true`
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar géneros:', error);
      throw error;
    }
  }

  /**
   * Busca un género por nombre exacto (método auxiliar)
   */
  private static async buscarGeneroPorNombre(nombre: string): Promise<GeneroMovie | null> {
    try {
      const response = await HttpClient.get<GeneroMovie[]>(
        `/generos?nombre=eq.${nombre}`
      );
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error al buscar género por nombre:', error);
      return null;
    }
  }

  /**
   * Verifica cuántas películas están asociadas a un género
   */
  private static async verificarPeliculasAsociadas(generoId: number): Promise<number> {
    try {
      const response = await HttpClient.get<any[]>(
        `/pelicula_generos?genero_id=eq.${generoId}&select=pelicula_id`
      );
      return response.data.length;
    } catch (error) {
      console.error('Error al verificar películas asociadas:', error);
      return 0;
    }
  }

  /**
   * Obtiene todos los géneros (incluyendo inactivos) - útil para administración
   */
  static async getAllGeneros(): Promise<GeneroMovie[]> {
    try {
      const response = await HttpClient.get<GeneroMovie[]>('/generos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los géneros:', error);
      throw error;
    }
  }

  /**
   * Obtiene géneros con el conteo de películas asociadas
   */
  static async getGenerosConConteo(): Promise<(GeneroMovie & { total_peliculas: number })[]> {
    try {
      // Esta consulta depende de las capacidades de tu configuración de Supabase
      // Puede que necesites crear una vista o función en la base de datos
      const response = await HttpClient.get<(GeneroMovie & { total_peliculas: number })[]>(
        '/generos?select=*,pelicula_generos(count)&activo=eq.true'
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener géneros con conteo:', error);
      // Fallback: obtener géneros y contar manualmente
      return await this.getGenerosConConteoManual();
    }
  }

  /**
   * Método auxiliar para obtener géneros con conteo manual
   */
  private static async getGenerosConConteoManual(): Promise<(GeneroMovie & { total_peliculas: number })[]> {
    try {
      const generos = await this.getGeneros();
      const generosConConteo = await Promise.all(
        generos.map(async (genero) => {
          const totalPeliculas = await this.verificarPeliculasAsociadas(genero.id);
          return {
            ...genero,
            total_peliculas: totalPeliculas
          };
        })
      );
      return generosConConteo;
    } catch (error) {
      console.error('Error al obtener géneros con conteo manual:', error);
      throw error;
    }
  }

  /**
   * Elimina físicamente un género con validación (usar con precaución - solo para casos especiales)
   */
  static async eliminarGeneroFisico(id: number): Promise<void> {
    try {
      // Verificar si hay películas asociadas
      const peliculasAsociadas = await this.verificarPeliculasAsociadas(id);
      if (peliculasAsociadas > 0) {
        throw new Error(`No se puede eliminar físicamente el género. Tiene ${peliculasAsociadas} película(s) asociada(s)`);
      }

      await HttpClient.delete(`/generos?id=eq.${id}`);
    } catch (error) {
      console.error('Error al eliminar género físicamente:', error);
      throw error;
    }
  }
}