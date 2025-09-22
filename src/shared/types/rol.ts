export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos: Record<string, any>;
  activo: boolean;
  fecha_creacion: string;
}

export interface CreateRolDto {
  nombre: string;
  descripcion?: string;
  permisos?: Record<string, any>;
}

export interface UpdateRolDto {
  nombre?: string;
  descripcion?: string;
  permisos?: Record<string, any>;
  activo?: boolean;
}
