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

// Función para generar UUID válido
function generarUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
    usuarioId?: string // Ahora es opcional
  ): Promise<{
    success: boolean;
    reserva?: Reserva;
    codigoOperacion?: string;
    error?: string;
  }> => {
    try {
      setLoading(true);
      setError(null);

      console.log('🛒 Procesando compra (versión simplificada):', datosCompra);

      const asientosConIds = await mapearAsientosAIds(
        datosCompra.asientosSeleccionados,
        datosCompra.funcionId,
        datosCompra.salaId
      );

      const datosReserva: any = {
        funcion_id: datosCompra.funcionId,
        metodo_pago: datosCompra.metodoPago,
        transaccion_id: `TXN-${Date.now()}`,
        notas: `Compra desde app - ${datosCompra.asientosSeleccionados.join(', ')}`,

        // Asientos
        asientos: asientosConIds.map((asiento) => ({
          asiento_id: asiento.asiento_id,
          precio: asiento.precio,
        })),

        productos:
          datosCompra.comidas?.map((comida) => ({
            producto_id: comida.id,
            cantidad: comida.cantidad,
            precio_unitario: comida.precio,
          })) || [],
      };

      if (usuarioId) {
        datosReserva.usuario_id = usuarioId;
      } else {
        // usuario anonimo
        datosReserva.usuario_id = '00000000-0000-0000-0000-000000000000';
      }

      console.log('📤 Enviando datos de reserva:', datosReserva);

      const resultado = await ReservaService.crearReservaCompleta(datosReserva);

      console.log('✅ Reserva procesada exitosamente:', resultado);

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
