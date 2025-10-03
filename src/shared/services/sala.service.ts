import { Sala, CreateSalaDto, UpdateSalaDto, Fila, CreateFilaDto } from '../types/sala';
import { HttpClient } from '../lib/useHttpClient';

// Interface para la respuesta de Supabase
interface SupabaseSala {
  id: number;
  cine_id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
  activa: boolean;
  configuracion_general?: Record<string, any>;
}

interface SupabaseFila {
  id: number;
  sala_id: number;
  letra: string;
  numero_fila: number;
  tipo_fila: string;
  cantidad_asientos: number;
  precio_multiplicador: number;
  activa: boolean;
}

// Mapear
function mapSupabaseToSala(supabaseSala: SupabaseSala): Sala {
  return {
    id: supabaseSala.id,
    cine_id: supabaseSala.cine_id,
    nombre: supabaseSala.nombre,
    capacidad: supabaseSala.capacidad,
    tipo: supabaseSala.tipo,
    activa: supabaseSala.activa,
    configuracion_general: supabaseSala.configuracion_general,
  };
}

// Mapear
function mapSupabaseToFila(supabaseFila: SupabaseFila): Fila {
  return {
    id: supabaseFila.id,
    sala_id: supabaseFila.sala_id,
    letra: supabaseFila.letra,
    numero_fila: supabaseFila.numero_fila,
    tipo_fila: supabaseFila.tipo_fila,
    cantidad_asientos: supabaseFila.cantidad_asientos,
    precio_multiplicador: supabaseFila.precio_multiplicador,
    activa: supabaseFila.activa,
  };
}

export class SalaService {
  // Obtener todas las salas
  static async getAllSalas(incluirInactivas: boolean = false): Promise<Sala[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<any[]>(
        `/salas?select=*,cines(id,nombre,direccion)&order=nombre.asc${filter}`
      );
      return response.data.map((sala) => ({
        ...mapSupabaseToSala(sala),
        cine: sala.cines
          ? {
              id: sala.cines.id,
              nombre: sala.cines.nombre,
              direccion: sala.cines.direccion,
            }
          : undefined,
      }));
    } catch (error) {
      console.error('Error al obtener salas:', error);
      throw new Error('No se pudieron cargar las salas');
    }
  }

  // Obtener salas por cine
  static async getSalasByCine(cineId: number, incluirInactivas: boolean = false): Promise<Sala[]> {
    try {
      const filter = incluirInactivas ? '' : '&activa=eq.true';
      const response = await HttpClient.get<SupabaseSala[]>(
        `/salas?cine_id=eq.${cineId}&order=nombre.asc${filter}`
      );
      return response.data.map(mapSupabaseToSala);
    } catch (error) {
      console.error('Error al obtener salas por cine:', error);
      throw new Error('No se pudieron cargar las salas del cine');
    }
  }

  // Obtener sala por ID
  static async getSalaById(id: number): Promise<Sala | null> {
    try {
      const response = await HttpClient.get<SupabaseSala[]>(`/salas?id=eq.${id}`);
      if (response.data.length === 0) return null;
      return mapSupabaseToSala(response.data[0]);
    } catch (error) {
      console.error('Error al obtener sala por ID:', error);
      return null;
    }
  }

  // Crear nueva sala con filas
  static async createSala(salaData: CreateSalaDto, filas: CreateFilaDto[]): Promise<Sala> {
    try {
      // Crear la sala
      const salaResponse = await HttpClient.post<SupabaseSala>('/salas', salaData);
      const sala = mapSupabaseToSala(salaResponse.data);

      // Crear las filas
      if (filas.length > 0) {
        const filasConSalaId = filas.map((fila) => ({
          ...fila,
          sala_id: sala.id,
          activa: true,
        }));

        await HttpClient.post('/filas', filasConSalaId);
      }

      return sala;
    } catch (error) {
      console.error('Error al crear sala:', error);
      throw new Error('No se pudo crear la sala');
    }
  }

  // Actualizar sala
  static async updateSala(
    id: number,
    updateData: UpdateSalaDto,
    filas?: CreateFilaDto[]
  ): Promise<Sala | null> {
    try {
      const response = await HttpClient.patch<SupabaseSala>(`/salas?id=eq.${id}`, updateData);
      if (!response.data) return null;
      if (filas) {
        await HttpClient.patch(`/filas?sala_id=eq.${id}`, { activa: false });

        if (filas.length > 0) {
          const filasConSalaId = filas.map((fila) => ({
            ...fila,
            sala_id: id,
            activa: true,
          }));

          await HttpClient.post('/filas', filasConSalaId);
        }
      }

      return mapSupabaseToSala(response.data);
    } catch (error) {
      console.error('Error al actualizar sala:', error);
      throw new Error('No se pudo actualizar la sala');
    }
  }

  // Cambiar estado de sala
  static async toggleSalaStatus(id: number, activa: boolean): Promise<boolean> {
    try {
      await HttpClient.patch(`/salas?id=eq.${id}`, { activa });
      return true;
    } catch (error) {
      console.error('Error al cambiar estado de sala:', error);
      return false;
    }
  }

  // Obtener filas de una sala
  static async getFilasBySala(salaId: number): Promise<Fila[]> {
    try {
      const response = await HttpClient.get<SupabaseFila[]>(
        `/filas?sala_id=eq.${salaId}&activa=eq.true&order=numero_fila.asc`
      );
      return response.data.map(mapSupabaseToFila);
    } catch (error) {
      console.error('Error al obtener filas:', error);
      throw new Error('No se pudieron cargar las filas');
    }
  }

  // Buscar salas
  static async buscarSalas(termino: string): Promise<Sala[]> {
    try {
      const response = await HttpClient.get<SupabaseSala[]>(
        `/salas?activa=eq.true&nombre=ilike.*${termino}*&order=nombre.asc`
      );
      return response.data.map(mapSupabaseToSala);
    } catch (error) {
      console.error('Error al buscar salas:', error);
      throw new Error('No se pudieron buscar las salas');
    }
  }
}
