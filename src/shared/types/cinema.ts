export interface Asiento {
  id: string;
  numero: number;
  ocupado: boolean;
  precio: number;
  tipo?: 'Normal' | 'VIP' | 'Discapacitado' | 'Pareja';
}

export interface Fila {
  letra: string;
  asientos: Asiento[];
  tipo?: 'Normal' | 'VIP' | 'Premium';
  precio_multiplicador?: number;
}

export { Cine, CreateCineDto, UpdateCineDto } from './cine';
export { Sala } from './sala';

export interface Funcion {
  id: string;
  pelicula_id: string;
  sala_id: number;
  fecha_hora: string;
  precio_base: number;
  precio_vip?: number;
  subtitulada: boolean;
  doblada: boolean;
  formato: '2D' | '3D' | 'IMAX';
  activa: boolean;
  asientos_disponibles: number;
}
