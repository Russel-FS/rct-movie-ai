import { HttpClient } from '../lib/useHttpClient';
import { MetodoPago } from '../types/pago';
import { Reserva } from '../types/reserva';

// Interfaces para Supabase
interface SupabaseReserva {
  id: string;
  usuario_id: string;
  funcion_id: string;
  codigo_reserva: string;
  estado: string;
  total: number;
  fecha_reserva: string;
  fecha_expiracion?: string;
  metodo_pago?: string;
  transaccion_id?: string;
  notas?: string;
}

interface CreateReservaCompleta {
  // Datos de la reserva
  usuario_id?: string; // Ahora es opcional
  funcion_id: string;
  metodo_pago: string;
  transaccion_id?: string;
  notas?: string;

  // Asientos seleccionados
  asientos: {
    asiento_id: number;
    precio: number;
  }[];

  // Productos de dulcería
  productos?: {
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

// Mapper
function mapSupabaseToReserva(supabaseReserva: SupabaseReserva): Reserva {
  return {
    id: supabaseReserva.id,
    usuario_id: supabaseReserva.usuario_id,
    funcion_id: supabaseReserva.funcion_id,
    codigo_reserva: supabaseReserva.codigo_reserva,
    estado: supabaseReserva.estado as 'pendiente' | 'confirmada' | 'cancelada' | 'expirada',
    total: supabaseReserva.total,
    fecha_reserva: supabaseReserva.fecha_reserva,
    fecha_expiracion: supabaseReserva.fecha_expiracion,
    metodo_pago: supabaseReserva.metodo_pago as MetodoPago,
    transaccion_id: supabaseReserva.transaccion_id,
    notas: supabaseReserva.notas,
  };
}

export class ReservaService {
  // Generar código único de reserva
  private static generarCodigoReserva(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `RES-${timestamp}-${random}`.toUpperCase();
  }

  // Crear reserva completa (versión simplificada)
  static async crearReservaCompleta(data: CreateReservaCompleta): Promise<{
    reserva: Reserva;
    entradas: any[];
    productos: any[];
  }> {
    try {
      console.log('📝 Iniciando creación de reserva con datos:', data);

      // 1. Calcular total
      const totalAsientos = data.asientos.reduce((sum, a) => sum + a.precio, 0);
      const totalProductos =
        data.productos?.reduce((sum, p) => sum + p.precio_unitario * p.cantidad, 0) || 0;
      const total = totalAsientos + totalProductos;

      // 2. Crear reserva principal - SOLO campos básicos
      const codigoReserva = this.generarCodigoReserva();

      const reservaData: any = {
        funcion_id: data.funcion_id,
        codigo_reserva: codigoReserva,
        estado: 'confirmada',
        total: total,
        metodo_pago: data.metodo_pago || 'yape',
        transaccion_id: data.transaccion_id || `TXN-${Date.now()}`,
        notas: data.notas || 'Compra desde app móvil',
      };

      // Solo agregar usuario_id si existe
      if (data.usuario_id) {
        reservaData.usuario_id = data.usuario_id;
      }

      console.log('📤 Enviando datos de reserva:', reservaData);

      const reservaResponse = await HttpClient.post<SupabaseReserva[]>('/reservas', reservaData, {
        headers: { Prefer: 'return=representation' },
      });

      if (!reservaResponse.data || reservaResponse.data.length === 0) {
        throw new Error('Error al crear la reserva - respuesta vacía');
      }

      const reserva = mapSupabaseToReserva(reservaResponse.data[0]);
      console.log('✅ Reserva creada:', reserva);

      // Por ahora, retornamos solo la reserva sin entradas ni productos
      // TODO: Implementar creación de entradas y productos después
      return {
        reserva,
        entradas: [],
        productos: [],
      };
    } catch (error: any) {
      console.error('❌ Error detallado al crear reserva:', error);
      if (error.response) {
        console.error('📄 Respuesta del servidor:', error.response.data);
        console.error('📊 Status:', error.response.status);
      }
      throw new Error(`No se pudo procesar la reserva: ${error.message}`);
    }
  }

  // Obtener reserva por ID
  static async getReservaById(id: string): Promise<Reserva | null> {
    try {
      const response = await HttpClient.get<SupabaseReserva[]>(`/reservas?id=eq.${id}&select=*`);

      if (response.data.length === 0) return null;
      return mapSupabaseToReserva(response.data[0]);
    } catch (error) {
      console.error('Error al obtener reserva:', error);
      return null;
    }
  }

  // Obtener reservas por usuario
  static async getReservasByUsuario(usuarioId: string): Promise<Reserva[]> {
    try {
      const response = await HttpClient.get<SupabaseReserva[]>(
        `/reservas?usuario_id=eq.${usuarioId}&select=*&order=fecha_reserva.desc`
      );

      return response.data.map(mapSupabaseToReserva);
    } catch (error) {
      console.error('Error al obtener reservas del usuario:', error);
      throw new Error('No se pudieron cargar las reservas');
    }
  }

  // Cancelar reserva
  static async cancelarReserva(id: string): Promise<boolean> {
    try {
      await HttpClient.patch(`/reservas?id=eq.${id}`, {
        estado: 'cancelada',
      });
      return true;
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      return false;
    }
  }

  // Obtener reserva completa con detalles
  static async getReservaCompleta(id: string): Promise<any> {
    try {
      const response = await HttpClient.get<any[]>(
        `/reservas?id=eq.${id}&select=*,` +
          `funciones(id,fecha_hora,formato,peliculas(titulo,poster_url),salas(nombre,cines(nombre))),` +
          `entradas(id,precio,codigo_qr,usado,asientos(numero,filas(letra))),` +
          `reserva_productos(id,cantidad,precio_unitario,subtotal,productos(nombre,imagen_url))`
      );

      return response.data[0] || null;
    } catch (error) {
      console.error('Error al obtener reserva completa:', error);
      return null;
    }
  }
}
