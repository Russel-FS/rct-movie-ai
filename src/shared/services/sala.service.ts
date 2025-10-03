import { Sala, CreateSalaDto, UpdateSalaDto, Fila, CreateFilaDto, Asiento } from '../types/sala';
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
  cines?: {
    id: number;
    nombre: string;
    direccion?: string;
  };
  filas?: SupabaseFila[];
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
  asientos?: SupabaseAsiento[];
}

interface SupabaseAsiento {
  id: number;
  fila_id: number;
  numero: number;
  tipo: string;
  activo: boolean;
  observaciones?: string;
}

// Mappers
function mapSupabaseToAsiento(supabaseAsiento: SupabaseAsiento): Asiento {
  return {
    id: supabaseAsiento.id,
    fila_id: supabaseAsiento.fila_id,
    numero: supabaseAsiento.numero,
    tipo: supabaseAsiento.tipo,
    activo: supabaseAsiento.activo,
    observaciones: supabaseAsiento.observaciones,
  };
}

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
    asientos: supabaseFila.asientos?.map(mapSupabaseToAsiento) || [],
  };
}

function mapSupabaseToSala(supabaseSala: SupabaseSala): Sala {
  return {
    id: supabaseSala.id,
    cine_id: supabaseSala.cine_id,
    nombre: supabaseSala.nombre,
    capacidad: supabaseSala.capacidad,
    tipo: supabaseSala.tipo,
    activa: supabaseSala.activa,
    configuracion_general: supabaseSala.configuracion_general,
    cine: supabaseSala.cines
      ? {
          id: supabaseSala.cines.id,
          nombre: supabaseSala.cines.nombre,
          direccion: supabaseSala.cines.direccion,
        }
      : undefined,
    filas: supabaseSala.filas?.map(mapSupabaseToFila) || [],
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
      const salaResponse = await HttpClient.post<SupabaseSala[]>(
        '/salas',
        { ...salaData, activa: true },
        {
          headers: {
            Prefer: 'return=representation',
          },
        }
      );

      if (!salaResponse.data || salaResponse.data.length === 0) {
        throw new Error('No se pudo crear la sala - respuesta vacía');
      }

      const salaCreada = salaResponse.data[0];

      // Crear las filas con el ID de la sala
      if (filas.length > 0) {
        const filasConSalaId = filas.map((fila, index) => ({
          ...fila,
          sala_id: salaCreada.id,
          numero_fila: index + 1,
          activa: true,
        }));

        await HttpClient.post('/filas', filasConSalaId, {
          headers: {
            Prefer: 'return=representation',
          },
        });

        // Crear asientos para cada fila
        for (const fila of filasConSalaId) {
          const asientos = Array.from({ length: fila.cantidad_asientos }, (_, i) => ({
            fila_id: null,
            numero: i + 1,
            tipo: 'Normal',
            activo: true,
          }));

          // crear la fila
          const filaCreada = await HttpClient.get<SupabaseFila[]>(
            `/filas?sala_id=eq.${salaCreada.id}&letra=eq.${fila.letra}`
          );

          // se crea el asiento
          if (filaCreada.data.length > 0) {
            const asientosConFilaId = asientos.map((asiento) => ({
              ...asiento,
              fila_id: filaCreada.data[0].id,
            }));

            await HttpClient.post('/asientos', asientosConFilaId);
          }
        }
      }

      return mapSupabaseToSala(salaCreada);
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
      const response = await HttpClient.patch<SupabaseSala[]>(`/salas?id=eq.${id}`, updateData, {
        headers: {
          Prefer: 'return=representation',
        },
      });

      if (!response.data || response.data.length === 0) return null;

      if (filas) {
        // Desactivar filas existentes
        await HttpClient.patch(`/filas?sala_id=eq.${id}`, { activa: false });

        // Eliminar asientos de filas existentes
        await HttpClient.delete(`/asientos?filas.sala_id=eq.${id}`);

        if (filas.length > 0) {
          const filasConSalaId = filas.map((fila, index) => ({
            ...fila,
            sala_id: id,
            numero_fila: index + 1,
            activa: true,
          }));

          await HttpClient.post('/filas', filasConSalaId, {
            headers: {
              Prefer: 'return=representation',
            },
          });

          // Crear asientos para cada fila nueva
          for (const fila of filasConSalaId) {
            const filaCreada = await HttpClient.get<SupabaseFila[]>(
              `/filas?sala_id=eq.${id}&letra=eq.${fila.letra}&activa=eq.true`
            );

            if (filaCreada.data.length > 0) {
              const asientos = Array.from({ length: fila.cantidad_asientos }, (_, i) => ({
                fila_id: filaCreada.data[0].id,
                numero: i + 1,
                tipo: 'Normal',
                activo: true,
              }));

              await HttpClient.post('/asientos', asientos);
            }
          }
        }
      }

      return mapSupabaseToSala(response.data[0]);
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

  // Obtener sala por ID con filas y asientos completos
  static async getSalaConButacas(id: number): Promise<Sala | null> {
    try {
      const response = await HttpClient.get<SupabaseSala[]>(
        `/salas?id=eq.${id}&select=*,cines(id,nombre,direccion),filas(id,letra,numero_fila,tipo_fila,cantidad_asientos,precio_multiplicador,activa,asientos(id,numero,tipo,activo,observaciones))&filas.order=numero_fila.asc&filas.asientos.order=numero.asc`
      );

      if (response.data.length === 0) return null;
      return mapSupabaseToSala(response.data[0]);
    } catch (error) {
      console.error('Error al obtener sala con butacas:', error);
      return null;
    }
  }

  // Obtener asientos ocupados para una función específica
  static async getAsientosOcupados(funcionId: string): Promise<number[]> {
    try {
      const response = await HttpClient.get<any[]>(
        `/entradas?select=asiento_id,reservas!inner(funcion_id,estado)&reservas.funcion_id=eq.${funcionId}&reservas.estado=in.(confirmada,pendiente)`
      );

      return response.data.map((entrada) => entrada.asiento_id);
    } catch (error) {
      console.error('Error al obtener asientos ocupados:', error);
      return [];
    }
  }

  // Obtener configuración completa de butacas para una función
  static async getButacasParaFuncion(
    funcionId: string,
    salaId: number
  ): Promise<{
    sala: Sala | null;
    asientosOcupados: number[];
  }> {
    try {
      const [sala, asientosOcupados] = await Promise.all([
        this.getSalaConButacas(salaId),
        this.getAsientosOcupados(funcionId),
      ]);

      return {
        sala,
        asientosOcupados,
      };
    } catch (error) {
      console.error('Error al obtener configuración de butacas:', error);
      throw new Error('No se pudo cargar la configuración de butacas');
    }
  }
}
