export type TipoAsiento = 'Normal' | 'VIP' | 'Discapacitado' | 'Pareja';

export interface Asiento {
  id: number;
  fila_id: number;
  numero: number;
  tipo: TipoAsiento;
  activo: boolean;
  observaciones?: string;
  ocupado?: boolean; // Para uso en frontend
}

export interface CreateAsientoDto {
  fila_id: number;
  numero: number;
  tipo: TipoAsiento;
  observaciones?: string;
}

export interface UpdateAsientoDto {
  numero?: number;
  tipo?: TipoAsiento;
  activo?: boolean;
  observaciones?: string;
}
