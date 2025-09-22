export type EstadoPago = 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
export type MetodoPago = 'visa' | 'mastercard' | 'yape' | 'plin' | 'efectivo';

export interface Pago {
  id: string;
  reserva_id: string;
  monto: number;
  metodo: MetodoPago;
  estado: EstadoPago;
  transaccion_externa_id?: string;
  fecha_pago: string;
  datos_pago?: Record<string, any>;
  comprobante_url?: string;
}

export interface CreatePagoDto {
  reserva_id: string;
  monto: number;
  metodo: MetodoPago;
  transaccion_externa_id?: string;
  datos_pago?: Record<string, any>;
}

export interface UpdatePagoDto {
  estado?: EstadoPago;
  transaccion_externa_id?: string;
  datos_pago?: Record<string, any>;
  comprobante_url?: string;
}
