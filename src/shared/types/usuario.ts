import { Rol } from './rol';

export type Genero = 'M' | 'F' | 'Otro';

export interface Usuario {
  id: string;
  email: string;
  password_hash: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: Genero;
  rol_id: number;
  activo: boolean;
  email_verificado: boolean;
  fecha_registro: string;
  ultima_conexion?: string;
  push_token?: string;
  preferencias: Record<string, any>;
  rol?: Rol;
}

export interface CreateUsuarioDto {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: Genero;
}

export interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: Genero;
  preferencias?: Record<string, any>;
}

export interface PerfilUsuario extends Omit<Usuario, 'password_hash'> {
  reservas_activas: number;
  total_reservas: number;
  peliculas_vistas: number;
}
