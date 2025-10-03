import { Sala } from './sala';

export interface Cine {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  latitud?: number;
  longitud?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  activo: boolean;
  fecha_creacion: string;
  imagen_url?: string;
  descripcion?: string;
  salas?: Sala[];
  // campo para la interfaz
  distance?: string;
}

export interface CreateCineDto {
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  latitud?: number;
  longitud?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  imagen_url?: string;
  descripcion?: string;
}

export interface UpdateCineDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  latitud?: number;
  longitud?: number;
  horario_apertura?: string;
  horario_cierre?: string;
  activo?: boolean;
  imagen_url?: string;
  descripcion?: string;
}
