import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Usuario {
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
  preferencias?: Record<string, any>;
  isAdmin: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, nombre: string, apellido: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<boolean>;
  updateUsuario: (updateData: any) => Promise<boolean>;
  refreshUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(
          `
          id, email, nombre, apellido, telefono, fecha_nacimiento, 
          genero, rol_id, activo, email_verificado, preferencias,
          roles(id, nombre, descripcion, permisos)
        `
        )
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const rol = Array.isArray(data.roles) && data.roles.length > 0 ? data.roles[0] : null;

        const isAdmin =
          rol?.nombre === 'Administrador' ||
          data.rol_id === 1 ||
          (rol?.permisos as any)?.admin === true;

        setUsuario({
          id: data.id,
          email: data.email,
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono,
          fecha_nacimiento: data.fecha_nacimiento,
          genero: data.genero,
          rol_id: data.rol_id,
          activo: data.activo,
          email_verificado: data.email_verificado,
          preferencias: data.preferencias || {},
          isAdmin,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase Login Error:', error);

        if (error.message?.includes('Email not confirmed')) {
          throw new Error(
            'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
          );
        }

        throw error;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    nombre: string,
    apellido: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase Auth Error:', error);
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from('usuarios').insert({
          id: data.user.id,
          email,
          password_hash: 'managed_by_supabase_auth',
          nombre,
          apellido,
          rol_id: 2,
          activo: true,
          email_verificado: false,
        });

        if (profileError) throw profileError;

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error registering:', error);

      if (error.message?.includes('already registered') || error.message?.includes('duplicate')) {
        throw new Error('Este email ya está registrado');
      } else if (error.message?.includes('invalid')) {
        throw new Error('Email inválido. Verifica que esté bien escrito');
      } else if (error.message?.includes('weak')) {
        throw new Error('La contraseña es muy débil');
      } else {
        throw new Error(error.message || 'Error al crear la cuenta');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUsuario(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const resendConfirmation = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resending confirmation:', error);
      return false;
    }
  };

  const updateUsuario = async (updateData: any): Promise<boolean> => {
    try {
      if (!usuario) return false;

      const { error } = await supabase.from('usuarios').update(updateData).eq('id', usuario.id);

      if (error) throw error;

      await loadUserProfile(usuario.id);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const refreshUsuario = async (): Promise<void> => {
    if (usuario) {
      await loadUserProfile(usuario.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        login,
        logout,
        register,
        resendConfirmation,
        updateUsuario,
        refreshUsuario,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
