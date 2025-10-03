import { Fila } from './fila';

export type TipoSala = 'Estándar' | 'VIP' | '3D' | 'IMAX';

export interface Sala {
  id: number;
  cine_id: number;
  nombre: string;
  capacidad: number;
  tipo: TipoSala;
  activa: boolean;
  configuracion_general?: Record<string, any>;
  filas?: Fila[];
}

export interface CreateSalaDto {
  cine_id: number;
  nombre: string;
  capacidad: number;
  tipo: TipoSala;
  configuracion_general?: Record<string, any>;
}

export interface UpdateSalaDto {
  cine_id?: number;
  nombre?: string;
  capacidad?: number;
  tipo?: TipoSala;
  activa?: boolean;
  configuracion_general?: Record<string, any>;
}
