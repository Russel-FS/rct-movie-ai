import {
  CategoriaProducto,
  CreateCategoriaProductoDto,
  UpdateCategoriaProductoDto,
} from '../types/categoria-producto';
import { HttpClient } from '../lib/useHttpClient';

// Interface para la respuesta de Supabase
interface SupabaseCategoriaProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden: number;
  activa: boolean;
  fecha_creacion: string;
}

// Mapper
function mapSupabaseToCategoria(supabaseCategoria: SupabaseCategoriaProducto): CategoriaProducto {
  return {
    id: supabaseCategoria.id,
    nombre: supabaseCategoria.nombre,
    descripcion: supabaseCategoria.descripcion,
    icono: supabaseCategoria.icono,
    color: supabaseCategoria.color,
    orden: supabaseCategoria.orden,
    activa: supabaseCategoria.activa,
    fecha_creacion: supabaseCategoria.fecha_creacion,
  };
}

export class CategoriaProductoService {
  // Obtener todas las categorías
  static async getAllCategorias(incluirInactivas: boolean = false): Promise<CategoriaProducto[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseCategoriaProducto[]>(
        `/categorias_productos?order=orden.asc,nombre.asc${filter}`
      );
      return response.data.map(mapSupabaseToCategoria);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw new Error('No se pudieron cargar las categorías');
    }
  }

  // Obtener categoría por ID
  static async getCategoriaById(id: number): Promise<CategoriaProducto | null> {
    try {
      const response = await HttpClient.get<SupabaseCategoriaProducto[]>(
        `/categorias_productos?id=eq.${id}`
      );
      if (response.data.length === 0) return null;
      return mapSupabaseToCategoria(response.data[0]);
    } catch (error) {
      console.error('Error al obtener categoría por ID:', error);
      return null;
    }
  }

  // Crear nueva categoría
  static async createCategoria(
    categoriaData: CreateCategoriaProductoDto
  ): Promise<CategoriaProducto> {
    try {
      const response = await HttpClient.post<SupabaseCategoriaProducto[]>(
        '/categorias_productos',
        { ...categoriaData, activa: true },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        throw new Error('No se pudo crear la categoría - respuesta vacía');
      }

      return mapSupabaseToCategoria(response.data[0]);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw new Error('No se pudo crear la categoría');
    }
  }

  // Actualizar categoría
  static async updateCategoria(
    id: number,
    updateData: UpdateCategoriaProductoDto
  ): Promise<CategoriaProducto | null> {
    try {
      const response = await HttpClient.patch<SupabaseCategoriaProducto[]>(
        `/categorias_productos?id=eq.${id}`,
        updateData,
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (!response.data || response.data.length === 0) return null;
      return mapSupabaseToCategoria(response.data[0]);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  }

  // Cambiar estado de categoría
  static async toggleCategoriaStatus(id: number, activa: boolean): Promise<boolean> {
    try {
      await HttpClient.patch(`/categorias_productos?id=eq.${id}`, { activa });
      return true;
    } catch (error) {
      console.error('Error al cambiar estado de categoría:', error);
      return false;
    }
  }

  // Eliminar categoría
  static async deleteCategoria(id: number): Promise<boolean> {
    try {
      await HttpClient.delete(`/categorias_productos?id=eq.${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return false;
    }
  }

  // Buscar categorías
  static async buscarCategorias(termino: string): Promise<CategoriaProducto[]> {
    try {
      const response = await HttpClient.get<SupabaseCategoriaProducto[]>(
        `/categorias_productos?activa=eq.true&nombre=ilike.*${termino}*&order=orden.asc,nombre.asc`
      );
      return response.data.map(mapSupabaseToCategoria);
    } catch (error) {
      console.error('Error al buscar categorías:', error);
      throw new Error('No se pudieron buscar las categorías');
    }
  }
}
