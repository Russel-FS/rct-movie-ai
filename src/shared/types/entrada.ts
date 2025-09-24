import { Asiento } from './asiento';

export interface Entrada {
  id: string;
  reserva_id: string;
  asiento_id: number;
  precio: number;
  codigo_qr?: string;
  usado: boolean;
  fecha_uso?: string;
  fecha_creacion: string;
  asiento?: Asiento;
}

export interface CreateEntradaDto {
  reserva_id: string;
  asiento_id: number;
  precio: number;
}

export interface UpdateEntradaDto {
  usado?: boolean;
  fecha_uso?: string;
}
