import { GeneroMovie } from './genero';

export type Clasificacion = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export interface Pelicula {
  id: string;
  titulo: string;
  titulo_original?: string;
  sinopsis?: string;
  duracion: number;
  clasificacion: Clasificacion;
  idioma_original?: string;
  subtitulos?: string;
  director?: string;
  reparto?: string;
  poster_url?: string;
  trailer_url?: string;
  fecha_estreno?: string;
  fecha_fin_exhibicion?: string;
  activa: boolean;
  destacada: boolean;
  calificacion?: number;
  votos: number;
  fecha_creacion: string;
  generos?: GeneroMovie[];
}

export interface PeliculaGenero {
  pelicula_id: string;
  genero_id: number;
}

export interface CreatePeliculaDto {
  titulo: string;
  titulo_original?: string;
  sinopsis?: string;
  duracion: number;
  clasificacion: Clasificacion;
  idioma_original?: string;
  subtitulos?: string;
  director?: string;
  reparto?: string;
  poster_url?: string;
  trailer_url?: string;
  fecha_estreno?: string;
  fecha_fin_exhibicion?: string;
  generos_ids?: number[];
}

export interface UpdatePeliculaDto {
  titulo?: string;
  titulo_original?: string;
  sinopsis?: string;
  duracion?: number;
  clasificacion?: Clasificacion;
  idioma_original?: string;
  subtitulos?: string;
  director?: string;
  reparto?: string;
  poster_url?: string;
  trailer_url?: string;
  fecha_estreno?: string;
  fecha_fin_exhibicion?: string;
  activa?: boolean;
  destacada?: boolean;
  generos_ids?: number[];
}
