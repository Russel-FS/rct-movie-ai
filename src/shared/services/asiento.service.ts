import { HttpClient } from '../lib/useHttpClient';

interface AsientoInfo {
  id: number;
  numero: number;
  fila_letra: string;
  fila_id: number;
  precio_base: number;
  precio_multiplicador: number;
  precio_final: number;
  tipo: string;
}

// Interfaces para las respuestas de Supabase
interface SupabaseFuncion {
  id: string;
  precio_base: number;
}

interface SupabaseFilaInfo {
  id: number;
  letra: string;
  precio_multiplicador: number;
  sala_id: number;
}

interface SupabaseAsientoConFila {
  id: number;
  numero: number;
  tipo: string;
  filas: SupabaseFilaInfo;
}

interface SupabaseEntradaOcupada {
  asiento_id: number;
  reservas: {
    funcion_id: string;
    estado: string;
  };
}

export class AsientoService {
  /**
   * Mapea los asientos seleccionados (formato "A1", "B2") a sus IDs reales en la base de datos
   * y calcula el precio final considerando el multiplicador de la fila
   */
  static async mapearAsientosSeleccionados(
    asientosSeleccionados: string[],
    funcionId: string,
    salaId: number
  ): Promise<AsientoInfo[]> {
    try {
      console.log('🎯 Mapeando asientos:', { asientosSeleccionados, funcionId, salaId });

      const funcionResponse = await HttpClient.get<SupabaseFuncion[]>(
        `/funciones?id=eq.${funcionId}&select=precio_base`
      );

      if (!funcionResponse.data || funcionResponse.data.length === 0) {
        throw new Error('Función no encontrada');
      }

      const precioBase = funcionResponse.data[0].precio_base;

      const asientosResponse = await HttpClient.get<SupabaseAsientoConFila[]>(
        `/asientos?select=id,numero,tipo,filas!inner(id,letra,precio_multiplicador,sala_id)&filas.sala_id=eq.${salaId}`
      );

      if (!asientosResponse.data || asientosResponse.data.length === 0) {
        throw new Error('No se encontraron asientos para esta sala');
      }

      const asientosInfo: AsientoInfo[] = [];

      for (const asientoSeleccionado of asientosSeleccionados) {
        const letra = asientoSeleccionado.charAt(0);
        const numero = parseInt(asientoSeleccionado.slice(1));

        const asientoEncontrado = asientosResponse.data.find(
          (asiento) => asiento.filas.letra === letra && asiento.numero === numero
        );

        if (!asientoEncontrado) {
          throw new Error(`Asiento ${asientoSeleccionado} no encontrado`);
        }

        const precioFinal = precioBase * asientoEncontrado.filas.precio_multiplicador;

        asientosInfo.push({
          id: asientoEncontrado.id,
          numero: asientoEncontrado.numero,
          fila_letra: asientoEncontrado.filas.letra,
          fila_id: asientoEncontrado.filas.id,
          precio_base: precioBase,
          precio_multiplicador: asientoEncontrado.filas.precio_multiplicador,
          precio_final: precioFinal,
          tipo: asientoEncontrado.tipo,
        });
      }

      console.log('✅ Asientos mapeados:', asientosInfo);
      return asientosInfo;
    } catch (error) {
      console.error('❌ Error al mapear asientos:', error);
      throw error;
    }
  }

  /**
   * Verifica si los asientos están disponibles para una función específica
   */
  static async verificarDisponibilidad(
    asientosIds: number[],
    funcionId: string
  ): Promise<{ disponible: boolean; asientosOcupados: number[] }> {
    try {
      // Obtener asientos ya reservados para esta función
      const ocupadosResponse = await HttpClient.get<SupabaseEntradaOcupada[]>(
        `/entradas?select=asiento_id,reservas!inner(funcion_id,estado)&reservas.funcion_id=eq.${funcionId}&reservas.estado=in.(confirmada,pendiente)`
      );

      const asientosOcupados = ocupadosResponse.data.map((entrada) => entrada.asiento_id);

      const conflictos = asientosIds.filter((id) => asientosOcupados.includes(id));

      return {
        disponible: conflictos.length === 0,
        asientosOcupados: conflictos,
      };
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }

  /**
   * Obtiene información detallada de un asiento específico
   */
  static async getAsientoById(asientoId: number): Promise<any> {
    try {
      const response = await HttpClient.get<any[]>(
        `/asientos?id=eq.${asientoId}&select=*,filas(letra,numero_fila,tipo_fila,precio_multiplicador,salas(nombre,cines(nombre)))`
      );

      return response.data[0] || null;
    } catch (error) {
      console.error('Error al obtener asiento:', error);
      return null;
    }
  }
}
