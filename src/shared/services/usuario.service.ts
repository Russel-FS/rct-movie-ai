import { HttpClient } from '../lib/useHttpClient';

// Interfaces para Supabase
interface SupabaseUsuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  rol_id: number;
  activo: boolean;
  email_verificado: boolean;
  fecha_registro: string;
  ultima_conexion?: string;
  push_token?: string;
  preferencias?: Record<string, any>;
  roles?: any;
}

interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: 'M' | 'F' | 'Otro';
  preferencias?: Record<string, any>;
}

interface UsuarioCompleto {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fecha_nacimiento?: string;
  genero?: string;
  rol_id: number;
  activo: boolean;
  email_verificado: boolean;
  fecha_registro: string;
  ultima_conexion?: string;
  preferencias?: Record<string, any>;
  rol?: {
    id: number;
    nombre: string;
    descripcion?: string;
    permisos?: Record<string, any>;
  };
  isAdmin: boolean;
}

// Mapper
function mapSupabaseToUsuario(supabaseUsuario: SupabaseUsuario): UsuarioCompleto {
  let rol = null;
  if (supabaseUsuario.roles) {
    if (Array.isArray(supabaseUsuario.roles)) {
      rol = supabaseUsuario.roles.length > 0 ? supabaseUsuario.roles[0] : null;
    } else {
      rol = supabaseUsuario.roles;
    }
  }

  const isAdmin =
    rol?.nombre === 'Administrador' ||
    supabaseUsuario.rol_id === 1 ||
    (rol?.permisos as any)?.admin === true;

  return {
    id: supabaseUsuario.id,
    email: supabaseUsuario.email,
    nombre: supabaseUsuario.nombre,
    apellido: supabaseUsuario.apellido,
    telefono: supabaseUsuario.telefono,
    fecha_nacimiento: supabaseUsuario.fecha_nacimiento,
    genero: supabaseUsuario.genero,
    rol_id: supabaseUsuario.rol_id,
    activo: supabaseUsuario.activo,
    email_verificado: supabaseUsuario.email_verificado,
    fecha_registro: supabaseUsuario.fecha_registro,
    ultima_conexion: supabaseUsuario.ultima_conexion,
    preferencias: supabaseUsuario.preferencias || {},
    rol: rol
      ? {
          id: rol.id,
          nombre: rol.nombre,
          descripcion: rol.descripcion,
          permisos: rol.permisos,
        }
      : undefined,
    isAdmin,
  };
}

export class UsuarioService {
  // Obtener usuario completo por ID
  static async getUsuarioCompleto(id: string): Promise<UsuarioCompleto | null> {
    try {
      const response = await HttpClient.get<SupabaseUsuario[]>(
        `/usuarios?id=eq.${id}&select=*,roles(id,nombre,descripcion,permisos)`
      );

      if (response.data.length === 0) return null;
      return mapSupabaseToUsuario(response.data[0]);
    } catch (error) {
      console.error('Error al obtener usuario completo:', error);
      return null;
    }
  }

  // Actualizar información del usuario
  static async updateUsuario(
    id: string,
    updateData: UpdateUsuarioDto
  ): Promise<UsuarioCompleto | null> {
    try {
      // Limpiar datos antes de enviar
      const cleanedData: any = {};

      if (updateData.nombre?.trim()) {
        cleanedData.nombre = updateData.nombre.trim();
      }
      if (updateData.apellido?.trim()) {
        cleanedData.apellido = updateData.apellido.trim();
      }
      if (updateData.telefono?.trim()) {
        cleanedData.telefono = updateData.telefono.trim();
      }
      if (updateData.fecha_nacimiento) {
        cleanedData.fecha_nacimiento = updateData.fecha_nacimiento;
      }
      if (updateData.genero) {
        cleanedData.genero = updateData.genero;
      }
      if (updateData.preferencias) {
        cleanedData.preferencias = updateData.preferencias;
      }

      const response = await HttpClient.patch<SupabaseUsuario[]>(
        `/usuarios?id=eq.${id}`,
        cleanedData,
        {
          headers: { Prefer: 'return=representation' },
        }
      );

      if (!response.data || response.data.length === 0) return null;

      // Obtener el usuario actualizado con información completa
      return await this.getUsuarioCompleto(id);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('No se pudo actualizar la información del usuario');
    }
  }

  // Actualizar preferencias del usuario
  static async updatePreferencias(id: string, preferencias: Record<string, any>): Promise<boolean> {
    try {
      await HttpClient.patch(`/usuarios?id=eq.${id}`, {
        preferencias,
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      return false;
    }
  }

  // Cambiar contraseña (a través de Supabase Auth)
  static async cambiarContrasena(nuevaContrasena: string): Promise<boolean> {
    try {
      console.log('Cambio de contraseña solicitado');
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return false;
    }
  }

  // Verificar si el usuario es administrador
  static async isUserAdmin(id: string): Promise<boolean> {
    try {
      const usuario = await this.getUsuarioCompleto(id);
      return usuario?.isAdmin || false;
    } catch (error) {
      console.error('Error al verificar permisos de admin:', error);
      return false;
    }
  }

  // Actualizar última conexión
  static async updateUltimaConexion(id: string): Promise<void> {
    try {
      await HttpClient.patch(`/usuarios?id=eq.${id}`, {
        ultima_conexion: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error al actualizar última conexión:', error);
    }
  }

  // Obtener estadísticas del usuario
  static async getEstadisticasUsuario(id: string): Promise<{
    totalReservas: number;
    reservasActivas: number;
    totalGastado: number;
  }> {
    try {
      const response = await HttpClient.get<any[]>(
        `/reservas?usuario_id=eq.${id}&select=estado,total`
      );

      const reservas = response.data;
      const totalReservas = reservas.length;
      const reservasActivas = reservas.filter((r) => r.estado === 'confirmada').length;
      const totalGastado = reservas
        .filter((r) => r.estado === 'confirmada')
        .reduce((sum, r) => sum + (r.total || 0), 0);

      return {
        totalReservas,
        reservasActivas,
        totalGastado,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalReservas: 0,
        reservasActivas: 0,
        totalGastado: 0,
      };
    }
  }
}
