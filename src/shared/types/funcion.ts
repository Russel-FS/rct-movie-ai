import { Pelicula } from './pelicula';
import { Sala } from './sala';

export type Formato = '2D' | '3D' | 'IMAX';

export interface Funcion {
  id: string;
  pelicula_id: string;
  sala_id: number;
  fecha_hora: string;
  precio_base: number;
  precio_vip?: number;
  subtitulada: boolean;
  doblada: boolean;
  formato: Formato;
  activa: boolean;
  asientos_disponibles?: number;
  fecha_creacion: string;
  pelicula?: Pelicula;
  sala?: Sala;
}

export interface CreateFuncionDto {
  pelicula_id: string;
  sala_id: number;
  fecha_hora: string;
  precio_base: number;
  precio_vip?: number;
  subtitulada?: boolean;
  doblada?: boolean;
  formato: Formato;
}

export interface UpdateFuncionDto {
  fecha_hora?: string;
  precio_base?: number;
  precio_vip?: number;
  subtitulada?: boolean;
  doblada?: boolean;
  formato?: Formato;
  activa?: boolean;
}
