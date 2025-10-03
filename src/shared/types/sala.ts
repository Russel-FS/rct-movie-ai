export interface Sala {
  id: number;
  cine_id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
  activa: boolean;
  configuracion_general?: Record<string, any>;

  // Relaciones
  cine?: {
    id: number;
    nombre: string;
  };
  filas?: Fila[];
}

export interface CreateSalaDto {
  cine_id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
  configuracion_general?: Record<string, any>;
}

export interface UpdateSalaDto extends Partial<CreateSalaDto> {
  activa?: boolean;
}

export interface Fila {
  id: number;
  sala_id: number;
  letra: string;
  numero_fila: number;
  tipo_fila: string;
  cantidad_asientos: number;
  precio_multiplicador: number;
  activa: boolean;

  // Relaciones
  asientos?: Asiento[];
}

export interface CreateFilaDto {
  letra: string;
  numero_fila: number;
  tipo_fila: string;
  cantidad_asientos: number;
  precio_multiplicador: number;
}

export interface UpdateFilaDto extends Partial<CreateFilaDto> {
  activa?: boolean;
}

export interface Asiento {
  id: number;
  fila_id: number;
  numero: number;
  tipo: string;
  activo: boolean;
  observaciones?: string;
}
