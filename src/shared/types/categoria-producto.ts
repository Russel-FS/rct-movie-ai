export interface CategoriaProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden: number;
  activa: boolean;
  fecha_creacion: string;
}

export interface CreateCategoriaProductoDto {
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
  orden: number;
}

export interface UpdateCategoriaProductoDto extends Partial<CreateCategoriaProductoDto> {
  activa?: boolean;
}
