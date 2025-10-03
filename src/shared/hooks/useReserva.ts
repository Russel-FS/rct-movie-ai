import { useState } from 'react';
import { ReservaService } from '../services/reserva.service';
import { AsientoService } from '../services/asiento.service';
import { Reserva } from '../types/reserva';

interface DatosCompra {
  funcionId: string;
  salaId: number;
  asientosSeleccionados: string[];
  comidas?: {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  metodoPago: string;
  subtotalEntradas: number;
  subtotalComidas: number;
  totalPagado: number;
}

interface AsientoConId {
  id: string;
  asiento_id: number;
  precio: number;
}

export function useReserva() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapearAsientosAIds = async (
    asientosSeleccionados: string[],
    funcionId: string,
    salaId: number
  ): Promise<AsientoConId[]> => {
    try {
      const asientosInfo = await AsientoService.mapearAsientosSeleccionados(
        asientosSeleccionados,
        funcionId,
        salaId
      );

      return asientosInfo.map((asiento) => ({
        id: `${asiento.fila_letra}${asiento.numero}`,
        asiento_id: asiento.id,
        precio: asiento.precio_final,
      }));
    } catch (error) {
      console.error('Error al mapear asientos:', error);
      throw error;
    }
  };

  const procesarCompra = async (
    datosCompra: DatosCompra,
    usuarioId?: string
  ): Promise<{
    success: boolean;
    reserva?: Reserva;
    codigoOperacion?: string;
    error?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Procesando compra completa:', datosCompra);

      // Mapear asientos seleccionados a IDs reales
      const asientosConIds = await mapearAsientosAIds(
        datosCompra.asientosSeleccionados,
        datosCompra.funcionId,
        datosCompra.salaId
      );

      //  Verificar disponibilidad de asientos
      const asientosIds = asientosConIds.map((a) => a.asiento_id);
      const disponibilidad = await AsientoService.verificarDisponibilidad(
        asientosIds,
        datosCompra.funcionId
      );

      if (!disponibilidad.disponible) {
        throw new Error(
          `Los siguientes asientos ya no están disponibles: ${disponibilidad.asientosOcupados.join(', ')}`
        );
      }

      //  Preparar datos para la reserva completa
      const datosReserva: any = {
        funcion_id: datosCompra.funcionId,
        metodo_pago: datosCompra.metodoPago,
        transaccion_id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        notas: `Compra desde app móvil - Asientos: ${datosCompra.asientosSeleccionados.join(', ')}`,

        // Asientos con precios calculados
        asientos: asientosConIds.map((asiento) => ({
          asiento_id: asiento.asiento_id,
          precio: asiento.precio,
        })),

        // Productos de dulcería
        productos:
          datosCompra.comidas?.map((comida) => ({
            producto_id: comida.id,
            cantidad: comida.cantidad,
            precio_unitario: comida.precio,
          })) || [],
      };

      // Agregar usuario si existe
      if (usuarioId && usuarioId !== '00000000-0000-0000-0000-000000000000') {
        datosReserva.usuario_id = usuarioId;
      }

      console.log('📤 Enviando datos de reserva completa:', datosReserva);

      //   Crear reserva completa con todo el flujo
      const resultado = await ReservaService.crearReservaCompleta(datosReserva);

      return {
        success: true,
        reserva: resultado.reserva,
        codigoOperacion: resultado.reserva.codigo_reserva,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la compra';
      console.error('❌ Error en procesarCompra:', errorMessage);
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const obtenerReserva = async (reservaId: string) => {
    try {
      setLoading(true);
      setError(null);

      const reserva = await ReservaService.getReservaById(reservaId);
      return reserva;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener la reserva';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obtenerReservasUsuario = async (usuarioId: string) => {
    try {
      setLoading(true);
      setError(null);

      const reservas = await ReservaService.getReservasByUsuario(usuarioId);
      return reservas;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener las reservas';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (reservaId: string) => {
    try {
      setLoading(true);
      setError(null);

      const success = await ReservaService.cancelarReserva(reservaId);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la reserva';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    procesarCompra,
    obtenerReserva,
    obtenerReservasUsuario,
    cancelarReserva,
  };
}
