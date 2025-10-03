import { Producto, CreateProductoDto, UpdateProductoDto } from '../types/producto';
import { HttpClient } from '../lib/useHttpClient';

// Interface para la respuesta de Supabase
interface SupabaseProducto {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  fecha_creacion: string;
  categorias_productos?: {
    id: number;
    nombre: string;
    descripcion?: string;
    icono?: string;
    color?: string;
  };
}

// Mapper
function mapSupabaseToProducto(supabaseProducto: SupabaseProducto): Producto {
  return {
    id: supabaseProducto.id,
    categoria_id: supabaseProducto.categoria_id,
    nombre: supabaseProducto.nombre,
    descripcion: supabaseProducto.descripcion,
    precio: supabaseProducto.precio,
    imagen_url: supabaseProducto.imagen_url,
    disponible: supabaseProducto.disponible,
    destacado: supabaseProducto.destacado,
    orden: supabaseProducto.orden,
    fecha_creacion: supabaseProducto.fecha_creacion,
    categoria: supabaseProducto.categorias_productos
      ? {
          id: supabaseProducto.categorias_productos.id,
          nombre: supabaseProducto.categorias_productos.nombre,
          descripcion: supabaseProducto.categorias_productos.descripcion,
          icono: supabaseProducto.categorias_productos.icono,
          color: supabaseProducto.categorias_productos.color,
          orden: 0,
          activa: true,
          fecha_creacion: '',
        }
      : undefined,
  };
}

export class ProductoService {
  // Obtener todos los productos
  static async getAllProductos(incluirNoDisponibles: boolean = false): Promise<Producto[]> {
    try {
      const filter = incluirNoDisponibles ? '' : '&disponible=eq.true';
      const response = await HttpClient.get<SupabaseProducto[]>(
        `/productos?select=*,categorias_productos(id,nombre,descripcion,icono,color)&order=orden.asc,nombre.asc${filter}`
      );
      return response.data.map(mapSupabaseToProducto);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  }

  // Obtener productos por categoría
  static async getProductosByCategoria(
    categoriaId: number,
    incluirNoDisponibles: boolean = false
  ): Promise<Producto[]> {
    try {
      const filter = incluirNoDisponibles ? '' : '&disponible=eq.true';
      const response = await HttpClient.get<SupabaseProducto[]>(
        `/productos?categoria_id=eq.${categoriaId}&select=*,categorias_productos(id,nombre,descripcion,icono,color)&order=orden.asc,nombre.asc${filter}`
      );
      return response.data.map(mapSupabaseToProducto);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw new Error('No se pudieron cargar los productos de la categoría');
    }
  }

  // Obtener producto por ID
  static async getProductoById(id: number): Promise<Producto | null> {
    try {
      const response = await HttpClient.get<SupabaseProducto[]>(
        `/productos?id=eq.${id}&select=*,categorias_productos(id,nombre,descripcion,icono,color)`
      );
      if (response.data.length === 0) return null;
      return mapSupabaseToProducto(response.data[0]);
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }

  // Crear nuevo producto
  static async createProducto(productoData: CreateProductoDto): Promise<Producto> {
    try {
      const response = await HttpClient.post<SupabaseProducto[]>(
        '/productos',
        { ...productoData, disponible: true },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (!response.data || response.data.length === 0) {
        throw new Error('No se pudo crear el producto - respuesta vacía');
      }

      return mapSupabaseToProducto(response.data[0]);
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error('No se pudo crear el producto');
    }
  }

  // Actualizar producto
  static async updateProducto(id: number, updateData: UpdateProductoDto): Promise<Producto | null> {
    try {
      const response = await HttpClient.patch<SupabaseProducto[]>(
        `/productos?id=eq.${id}`,
        updateData,
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (!response.data || response.data.length === 0) return null;
      return mapSupabaseToProducto(response.data[0]);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  // Cambiar disponibilidad del producto
  static async toggleProductoDisponibilidad(id: number, disponible: boolean): Promise<boolean> {
    try {
      await HttpClient.patch(`/productos?id=eq.${id}`, { disponible });
      return true;
    } catch (error) {
      console.error('Error al cambiar disponibilidad del producto:', error);
      return false;
    }
  }

  // Eliminar producto
  static async deleteProducto(id: number): Promise<boolean> {
    try {
      await HttpClient.delete(`/productos?id=eq.${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  // Buscar productos
  static async buscarProductos(termino: string): Promise<Producto[]> {
    try {
      const response = await HttpClient.get<SupabaseProducto[]>(
        `/productos?disponible=eq.true&nombre=ilike.*${termino}*&select=*,categorias_productos(id,nombre,descripcion,icono,color)&order=orden.asc,nombre.asc`
      );
      return response.data.map(mapSupabaseToProducto);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw new Error('No se pudieron buscar los productos');
    }
  }

  // Obtener productos destacados
  static async getProductosDestacados(): Promise<Producto[]> {
    try {
      const response = await HttpClient.get<SupabaseProducto[]>(
        `/productos?destacado=eq.true&disponible=eq.true&select=*,categorias_productos(id,nombre,descripcion,icono,color)&order=orden.asc,nombre.asc`
      );
      return response.data.map(mapSupabaseToProducto);
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      throw new Error('No se pudieron cargar los productos destacados');
    }
  }
}
