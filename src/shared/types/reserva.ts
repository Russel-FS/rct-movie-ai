import { Usuario } from './usuario';
import { Funcion } from './funcion';
import { Entrada } from './entrada';
import { Pago } from './pago';

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'expirada';
export type MetodoPago = 'visa' | 'mastercard' | 'yape' | 'plin' | 'efectivo';

export interface Reserva {
  id: string;
  usuario_id: string;
  funcion_id: string;
  codigo_reserva: string;
  estado: EstadoReserva;
  total: number;
  fecha_reserva: string;
  fecha_expiracion?: string;
  metodo_pago?: MetodoPago;
  transaccion_id?: string;
  notas?: string;
  usuario?: Usuario;
  funcion?: Funcion;
  entradas?: Entrada[];
  pagos?: Pago[];
}

export interface CreateReservaDto {
  funcion_id: string;
  asientos_ids: number[];
  metodo_pago?: MetodoPago;
  notas?: string;
}

export interface UpdateReservaDto {
  estado?: EstadoReserva;
  metodo_pago?: MetodoPago;
  transaccion_id?: string;
  notas?: string;
}

export interface HistorialReserva extends Reserva {
  pelicula_titulo: string;
  sala_nombre: string;
  fecha_funcion: string;
  entradas_count: number;
}
