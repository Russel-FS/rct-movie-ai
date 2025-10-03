import { Funcion, CreateFuncionDto, UpdateFuncionDto, Formato } from '../types/funcion';
import { HttpClient } from '../lib/useHttpClient';

// Interface para la respuesta de Supabase
interface SupabaseFuncion {
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
  peliculas?: {
    id: string;
    titulo: string;
    poster_url?: string;
    duracion: number;
    clasificacion: string;
  };
  salas?: {
    id: number;
    nombre: string;
    capacidad: number;
    tipo: string;
    cines?: {
      id: number;
      nombre: string;
      direccion: string;
    };
  };
}

// Mapear función de Supabase a nuestro tipo
function mapSupabaseToFuncion(supabaseFuncion: SupabaseFuncion): Funcion {
  return {
    id: supabaseFuncion.id,
    pelicula_id: supabaseFuncion.pelicula_id,
    sala_id: supabaseFuncion.sala_id,
    fecha_hora: supabaseFuncion.fecha_hora,
    precio_base: supabaseFuncion.precio_base,
    precio_vip: supabaseFuncion.precio_vip,
    subtitulada: supabaseFuncion.subtitulada,
    doblada: supabaseFuncion.doblada,
    formato: supabaseFuncion.formato,
    activa: supabaseFuncion.activa,
    asientos_disponibles: supabaseFuncion.asientos_disponibles,
    fecha_creacion: supabaseFuncion.fecha_creacion,
    pelicula: supabaseFuncion.peliculas
      ? ({
          id: supabaseFuncion.peliculas.id,
          titulo: supabaseFuncion.peliculas.titulo,
          poster_url: supabaseFuncion.peliculas.poster_url,
          duracion: supabaseFuncion.peliculas.duracion,
          clasificacion: supabaseFuncion.peliculas.clasificacion,
        } as any)
      : undefined,
    sala: supabaseFuncion.salas
      ? ({
          id: supabaseFuncion.salas.id,
          nombre: supabaseFuncion.salas.nombre,
          capacidad: supabaseFuncion.salas.capacidad,
          tipo: supabaseFuncion.salas.tipo,
          cine: supabaseFuncion.salas.cines
            ? ({
                id: supabaseFuncion.salas.cines.id,
                nombre: supabaseFuncion.salas.cines.nombre,
                direccion: supabaseFuncion.salas.cines.direccion,
              } as any)
            : undefined,
        } as any)
      : undefined,
  };
}

export class FuncionService {
  // Obtener todas las funciones
  static async getAllFunciones(incluirInactivas: boolean = false): Promise<Funcion[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.desc${filter}`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al obtener funciones:', error);
      throw new Error('No se pudieron cargar las funciones');
    }
  }

  // Obtener funciones por película
  static async getFuncionesByPelicula(
    peliculaId: string,
    incluirInactivas: boolean = false
  ): Promise<Funcion[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?pelicula_id=eq.${peliculaId}&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.asc${filter}`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al obtener funciones por película:', error);
      throw new Error('No se pudieron cargar las funciones de la película');
    }
  }

  // Obtener funciones por sala
  static async getFuncionesBySala(
    salaId: number,
    incluirInactivas: boolean = false
  ): Promise<Funcion[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?sala_id=eq.${salaId}&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.asc${filter}`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al obtener funciones por sala:', error);
      throw new Error('No se pudieron cargar las funciones de la sala');
    }
  }

  // Obtener funciones por cine
  static async getFuncionesByCine(
    cineId: number,
    incluirInactivas: boolean = false
  ): Promise<Funcion[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?salas.cine_id=eq.${cineId}&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.asc${filter}`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al obtener funciones por cine:', error);
      throw new Error('No se pudieron cargar las funciones del cine');
    }
  }

  // Obtener función por ID
  static async getFuncionById(id: string): Promise<Funcion | null> {
    try {
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?id=eq.${id}&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))`
      );
      if (response.data.length === 0) return null;
      return mapSupabaseToFuncion(response.data[0]);
    } catch (error) {
      console.error('Error al obtener función por ID:', error);
      return null;
    }
  }

  // Crear nueva función
  static async createFuncion(funcionData: CreateFuncionDto): Promise<Funcion> {
    try {
      const response = await HttpClient.post<SupabaseFuncion>('/funciones', {
        ...funcionData,
        activa: true,
      });
      return mapSupabaseToFuncion(response.data);
    } catch (error) {
      console.error('Error al crear función:', error);
      throw new Error('No se pudo crear la función');
    }
  }

  // Actualizar función
  static async updateFuncion(id: string, updateData: UpdateFuncionDto): Promise<Funcion | null> {
    try {
      const response = await HttpClient.patch<SupabaseFuncion>(
        `/funciones?id=eq.${id}`,
        updateData
      );
      if (!response.data) return null;
      return mapSupabaseToFuncion(response.data);
    } catch (error) {
      console.error('Error al actualizar función:', error);
      throw new Error('No se pudo actualizar la función');
    }
  }

  // Cambiar estado de función
  static async toggleFuncionStatus(id: string, activa: boolean): Promise<boolean> {
    try {
      await HttpClient.patch(`/funciones?id=eq.${id}`, { activa });
      return true;
    } catch (error) {
      console.error('Error al cambiar estado de función:', error);
      return false;
    }
  }

  // Eliminar función
  static async deleteFuncion(id: string): Promise<boolean> {
    try {
      await HttpClient.delete(`/funciones?id=eq.${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar función:', error);
      return false;
    }
  }

  // Buscar funciones
  static async buscarFunciones(termino: string): Promise<Funcion[]> {
    try {
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?activa=eq.true&peliculas.titulo=ilike.*${termino}*&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.asc`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al buscar funciones:', error);
      throw new Error('No se pudieron buscar las funciones');
    }
  }

  // Obtener cines disponibles para una película específica
  static async getCinesDisponiblesPorPelicula(peliculaId: string): Promise<any[]> {
    try {
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?pelicula_id=eq.${peliculaId}&activa=eq.true&select=salas(cines(id,nombre,direccion,latitud,longitud))&order=fecha_hora.asc`
      );

      // Extraer cines únicos
      const cinesMap = new Map();
      response.data.forEach((funcion) => {
        if (funcion.salas?.cines) {
          const cine = funcion.salas.cines;
          if (!cinesMap.has(cine.id)) {
            cinesMap.set(cine.id, cine);
          }
        }
      });

      return Array.from(cinesMap.values());
    } catch (error) {
      console.error('Error al obtener cines disponibles:', error);
      throw new Error('No se pudieron cargar los cines disponibles');
    }
  }

  // Obtener funciones por película y cine
  static async getFuncionesByPeliculaYCine(peliculaId: string, cineId: number): Promise<Funcion[]> {
    try {
      const response = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?pelicula_id=eq.${peliculaId}&salas.cine_id=eq.${cineId}&activa=eq.true&select=*,peliculas(id,titulo,poster_url,duracion,clasificacion),salas(id,nombre,capacidad,tipo,cines(id,nombre,direccion))&order=fecha_hora.asc`
      );
      return response.data.map(mapSupabaseToFuncion);
    } catch (error) {
      console.error('Error al obtener funciones por película y cine:', error);
      throw new Error('No se pudieron cargar las funciones');
    }
  }
}
