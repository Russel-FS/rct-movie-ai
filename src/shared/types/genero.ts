export interface GeneroMovie {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CreateGeneroDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateGeneroDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}
