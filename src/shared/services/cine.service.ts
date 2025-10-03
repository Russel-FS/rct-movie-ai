import { Cine, CreateCineDto, UpdateCineDto } from '../types/cine';
import { HttpClient } from '../lib/useHttpClient';
import { calcularDistancia, formatearDistancia } from '../utils/location.utils';

// Interface para la respuesta de Supabase
interface SupabaseCine {
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
}

// mappear de Supabase a Cine
function mapSupabaseToCine(supabaseCine: SupabaseCine, userLat?: number, userLon?: number): Cine {
  let distance: string | undefined;

  // se calcula la distancia si se proporcionan latitud y longitud
  if (userLat && userLon && supabaseCine.latitud && supabaseCine.longitud) {
    const distanceKm = calcularDistancia(
      userLat,
      userLon,
      supabaseCine.latitud,
      supabaseCine.longitud
    );
    distance = formatearDistancia(distanceKm);
  }

  return {
    id: supabaseCine.id,
    nombre: supabaseCine.nombre,
    direccion: supabaseCine.direccion,
    telefono: supabaseCine.telefono,
    email: supabaseCine.email,
    latitud: supabaseCine.latitud,
    longitud: supabaseCine.longitud,
    horario_apertura: supabaseCine.horario_apertura,
    horario_cierre: supabaseCine.horario_cierre,
    activo: supabaseCine.activo,
    fecha_creacion: supabaseCine.fecha_creacion,
    imagen_url: supabaseCine.imagen_url,
    descripcion: supabaseCine.descripcion,
    distance,
  };
}

export class CineService {
  // se obtiene todos los cines activos
  static async getCines(userLat?: number, userLon?: number): Promise<Cine[]> {
    try {
      const response = await HttpClient.get<SupabaseCine[]>(
        '/cines?activo=eq.true&order=nombre.asc'
      );
      return response.data.map((cine) => mapSupabaseToCine(cine, userLat, userLon));
    } catch (error) {
      console.error('Error al obtener cines:', error);
      throw new Error('No se pudieron cargar los cines');
    }
  }

  // Obtener cine por ID
  static async getCineById(id: number, userLat?: number, userLon?: number): Promise<Cine | null> {
    try {
      const response = await HttpClient.get<SupabaseCine[]>(`/cines?id=eq.${id}`);
      if (response.data.length === 0) return null;
      return mapSupabaseToCine(response.data[0], userLat, userLon);
    } catch (error) {
      console.error('Error al obtener cine por ID:', error);
      return null;
    }
  }

  // Obtener cines cercanos (basado en coordenadas)
  static async getCinesCercanos(
    latitud: number,
    longitud: number,
    radio: number = 10
  ): Promise<Cine[]> {
    try {
      // Obtener todos los cines activos
      const cines = await this.getCines(latitud, longitud);

      // Filtrar por radio de distancia
      return cines
        .filter((cine) => {
          if (!cine.latitud || !cine.longitud) return false;
          const distanceKm = calcularDistancia(latitud, longitud, cine.latitud, cine.longitud);
          return distanceKm <= radio;
        })
        .sort((a, b) => {
          const distA = a.distance ? parseFloat(a.distance.replace(' km', '')) : Infinity;
          const distB = b.distance ? parseFloat(b.distance.replace(' km', '')) : Infinity;
          return distA - distB;
        });
    } catch (error) {
      console.error('Error al obtener cines cercanos:', error);
      throw new Error('No se pudieron cargar los cines cercanos');
    }
  }

  // Crear nuevo cine
  static async createCine(cineData: CreateCineDto): Promise<Cine> {
    try {
      const response = await HttpClient.post<SupabaseCine>('/cines', cineData);
      return mapSupabaseToCine(response.data);
    } catch (error) {
      console.error('Error al crear cine:', error);
      throw new Error('No se pudo crear el cine');
    }
  }

  // Actualizar cine
  static async updateCine(id: number, updateData: UpdateCineDto): Promise<Cine | null> {
    try {
      const response = await HttpClient.patch<SupabaseCine>(`/cines?id=eq.${id}`, updateData);
      if (!response.data) return null;
      return mapSupabaseToCine(response.data);
    } catch (error) {
      console.error('Error al actualizar cine:', error);
      throw new Error('No se pudo actualizar el cine');
    }
  }

  // Eliminar cine - se desactiva
  static async deleteCine(id: number): Promise<boolean> {
    try {
      await HttpClient.patch(`/cines?id=eq.${id}`, { activo: false });
      return true;
    } catch (error) {
      console.error('Error al eliminar cine:', error);
      return false;
    }
  }

  // Buscar cines por nombre
  static async buscarCines(termino: string, userLat?: number, userLon?: number): Promise<Cine[]> {
    try {
      const response = await HttpClient.get<SupabaseCine[]>(
        `/cines?activo=eq.true&nombre=ilike.*${termino}*&order=nombre.asc`
      );
      return response.data.map((cine) => mapSupabaseToCine(cine, userLat, userLon));
    } catch (error) {
      console.error('Error al buscar cines:', error);
      throw new Error('No se pudieron buscar los cines');
    }
  }

  // Obtener cines con sus salas
  static async getCinesConSalas(userLat?: number, userLon?: number): Promise<Cine[]> {
    try {
      const response = await HttpClient.get<SupabaseCine[]>(
        '/cines?activo=eq.true&select=*,salas(*)&order=nombre.asc'
      );
      return response.data.map((cine) => mapSupabaseToCine(cine, userLat, userLon));
    } catch (error) {
      console.error('Error al obtener cines con salas:', error);
      throw new Error('No se pudieron cargar los cines con salas');
    }
  }
}
