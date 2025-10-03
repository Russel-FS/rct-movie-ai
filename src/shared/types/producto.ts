import { CategoriaProducto } from './categoria-producto';

export interface Producto {
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

  // Relaciones
  categoria?: CategoriaProducto;
}

export interface CreateProductoDto {
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  destacado?: boolean;
  orden: number;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {
  disponible?: boolean;
}
