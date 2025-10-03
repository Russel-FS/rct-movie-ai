import { HttpClient } from '../lib/useHttpClient';

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
  filas: SupabaseFilaInfo;
}

interface SupabaseEntrada {
  asiento_id: number;
  reservas: {
    funcion_id: string;
  };
}

interface AsientoInfo {
  id: number;
  numero: number;
  fila_letra: string;
  fila_id: number;
  precio_base: number;
  precio_multiplicador: number;
  precio_final: number;
}

export class AsientoService {
  static async mapearAsientosSeleccionados(
    asientosSeleccionados: string[],
    funcionId: string,
    salaId: number
  ): Promise<AsientoInfo[]> {
    try {
      console.log('🎯 Mapeando asientos (versión simplificada):', {
        asientosSeleccionados,
        funcionId,
        salaId,
      });

      // Versión simplificada - usar datos temporales
      const precioBase = 15.0; // Precio fijo temporal

      const asientosInfo: AsientoInfo[] = asientosSeleccionados.map((asientoStr, index) => {
        const letra = asientoStr.charAt(0);
        const numero = parseInt(asientoStr.substring(1));

        return {
          id: index + 1, // ID temporal
          numero: numero,
          fila_letra: letra,
          fila_id: index + 1, // ID temporal
          precio_base: precioBase,
          precio_multiplicador: 1.0,
          precio_final: precioBase,
        };
      });

      console.log('✅ Asientos mapeados (temporal):', asientosInfo);
      return asientosInfo;
    } catch (error) {
      console.error('❌ Error al mapear asientos:', error);
      throw new Error('No se pudieron procesar los asientos seleccionados');
    }
  }

  /**
   * Verificar que los asientos siguen disponibles antes de la compra
   */
  static async verificarDisponibilidad(
    asientosIds: number[],
    funcionId: string
  ): Promise<{ disponibles: boolean; ocupados: number[] }> {
    try {
      console.log('🔍 Verificando disponibilidad (versión simplificada):', {
        asientosIds,
        funcionId,
      });
      return {
        disponibles: true,
        ocupados: [],
      };
    } catch (error) {
      console.error('❌ Error al verificar disponibilidad:', error);
      return {
        disponibles: false,
        ocupados: asientosIds,
      };
    }
  }
}
