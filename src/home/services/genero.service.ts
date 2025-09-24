import { GeneroMovie } from '~/shared/types';
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
}
