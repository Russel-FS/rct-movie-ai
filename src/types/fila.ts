import { Asiento } from './asiento';

export type TipoFila = 'Normal' | 'VIP' | 'Premium';

export interface Fila {
  id: number;
  sala_id: number;
  letra: string;
  numero_fila: number;
  tipo_fila: TipoFila;
  cantidad_asientos: number;
  precio_multiplicador: number;
  activa: boolean;
  asientos?: Asiento[];
}

export interface CreateFilaDto {
  sala_id: number;
  letra: string;
  numero_fila: number;
  tipo_fila: TipoFila;
  cantidad_asientos: number;
  precio_multiplicador?: number;
}

export interface UpdateFilaDto {
  letra?: string;
  numero_fila?: number;
  tipo_fila?: TipoFila;
  cantidad_asientos?: number;
  precio_multiplicador?: number;
  activa?: boolean;
}
