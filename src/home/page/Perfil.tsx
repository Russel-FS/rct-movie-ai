import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  User,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Settings,
  LogOut,
  Shield,
  Crown,
  Calendar,
  Edit3,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/types/navigation';
import { useAuth } from '~/shared/contexts/AuthContext';
import { UsuarioService } from '~/shared/services/usuario.service';
import EditarPerfilModal from '../components/EditarPerfilModal';

type PerfilNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Interfaz para los items del perfil
interface ProfileItem {
  id: string;
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}

export default function Perfil() {
  const navigation = useNavigation<PerfilNavigationProp>();
  const { usuario, logout, updateUsuario, refreshUsuario, loading: authLoading } = useAuth();

  // Estados para los switches de configuración
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [estadisticas, setEstadisticas] = useState<{
    totalReservas: number;
    reservasActivas: number;
    totalGastado: number;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (usuario) {
      loadEstadisticas();
      const prefs = usuario.preferencias || {};
      setNotifications(prefs.notifications !== false);
      setDarkMode(prefs.darkMode !== false);
    }
  }, [usuario]);

  const loadEstadisticas = async () => {
    if (!usuario) return;

    try {
      setLoadingStats(true);
      const stats = await UsuarioService.getEstadisticasUsuario(usuario.id);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    if (!usuario) return;

    const newPreferences = {
      ...usuario.preferencias,
      [key]: value,
    };

    try {
      const success = await updateUsuario({ preferencias: newPreferences });
      if (success) {
        if (key === 'notifications') setNotifications(value);
        if (key === 'darkMode') setDarkMode(value);
      }
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      Alert.alert('Error', 'No se pudieron guardar las preferencias');
    }
  };

  if (authLoading || !usuario) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando perfil...</Text>
      </View>
    );
  }

  // Items de información personal basados en datos reales
  const profileItems: ProfileItem[] = [
    {
      id: 'name',
      title: 'Nombre completo',
      value: `${usuario.nombre} ${usuario.apellido}`,
      icon: User,
    },
    {
      id: 'email',
      title: 'Email',
      value: usuario.email,
      icon: Mail,
    },
    {
      id: 'phone',
      title: 'Teléfono',
      value: usuario.telefono || 'No registrado',
      icon: Phone,
    },
    {
      id: 'birthday',
      title: 'Fecha de nacimiento',
      value: usuario.fecha_nacimiento
        ? new Date(usuario.fecha_nacimiento).toLocaleDateString('es-ES')
        : 'No registrada',
      icon: Calendar,
    },
    {
      id: 'password',
      title: 'Contraseña',
      value: '••••••••',
      icon: Lock,
    },
  ];

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // La navegación se manejará automáticamente por el AuthContext
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }
        },
      },
    ]);
  };

  const handleAdminAccess = () => {
    navigation.navigate('AdminDashboard');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileSaved = () => {
    loadEstadisticas();
  };

  const ProfileItemRow: React.FC<{ item: ProfileItem }> = ({ item }) => (
    <TouchableOpacity
      className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      onPress={() => {
        if (item.id === 'password') {
          Alert.alert('Cambiar Contraseña', 'Funcionalidad próximamente disponible');
        } else if (item.id !== 'email') {
          handleEditProfile();
        }
      }}
      activeOpacity={0.8}>
      <View className="flex-row items-center p-6">
        <View className="mr-4 rounded-full bg-gray-700/50 p-3">
          <item.icon size={20} color="#9CA3AF" />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-gray-400">{item.title}</Text>
          <Text className="text-base font-medium text-white">{item.value}</Text>
          {item.id === 'email' && !usuario.email_verificado && (
            <Text className="mt-1 text-xs text-yellow-400">⚠️ Email no verificado</Text>
          )}
        </View>
        {item.id !== 'email' && <ChevronRight size={20} color="#6B7280" />}
        {item.id === 'email' && (
          <View className="rounded-full bg-green-500/10 px-2 py-1">
            <Text className="text-xs text-green-400">{usuario.email_verificado ? '✓' : '!'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const ConfigItemRow: React.FC<{
    title: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    preferenceKey: string;
  }> = ({ title, value, onToggle, preferenceKey }) => (
    <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-6">
      <Text className="text-base font-medium text-white">{title}</Text>
      <Switch
        value={value}
        onValueChange={(newValue) => {
          onToggle(newValue);
          handlePreferenceChange(preferenceKey, newValue);
        }}
        trackColor={{ false: '#374151', true: '#FFFFFF' }}
        thumbColor={value ? '#000000' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pb-6 pt-14">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-gray-400">Mi perfil</Text>
              <Text className="text-2xl font-bold text-white">Configuración</Text>
            </View>
            <TouchableOpacity className="rounded-full bg-gray-800/50 p-3">
              <Settings size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4">
          {/* Avatar y nombre del usuario */}
          <View className="mb-8 items-center rounded-3xl bg-gray-800/30 p-8">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-700/50">
              <User size={32} color="#9CA3AF" />
            </View>
            <Text className="mb-1 text-xl font-bold text-white">
              {usuario.nombre} {usuario.apellido}
            </Text>
            <Text className="text-sm text-gray-400">{usuario.email}</Text>

            {/* Estadísticas del usuario */}
            {estadisticas && (
              <View className="mt-4 flex-row space-x-6">
                <View className="items-center">
                  <Text className="text-lg font-bold text-white">{estadisticas.totalReservas}</Text>
                  <Text className="text-xs text-gray-400">Reservas</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-green-400">
                    {estadisticas.reservasActivas}
                  </Text>
                  <Text className="text-xs text-gray-400">Activas</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-blue-400">
                    S/ {estadisticas.totalGastado.toFixed(0)}
                  </Text>
                  <Text className="text-xs text-gray-400">Gastado</Text>
                </View>
              </View>
            )}

            {loadingStats && <ActivityIndicator size="small" color="#9CA3AF" className="mt-4" />}
          </View>

          {/* Información Personal */}
          <Text className="mb-6 text-xl font-bold text-white">Información Personal</Text>

          {profileItems.map((item) => (
            <ProfileItemRow key={item.id} item={item} />
          ))}

          {/* Sección de Administración */}
          {usuario.isAdmin && (
            <>
              <Text className="mb-6 mt-8 text-xl font-bold text-white">Administración</Text>

              <TouchableOpacity
                className="mb-4 overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20"
                onPress={handleAdminAccess}
                activeOpacity={0.8}>
                <View className="flex-row items-center p-6">
                  <View className="mr-4 rounded-full bg-purple-600/30 p-3">
                    <Crown size={20} color="#A855F7" />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-sm font-medium text-purple-300">
                      Panel de Control
                    </Text>
                    <Text className="text-base font-medium text-white">Administrar Sistema</Text>
                    <Text className="mt-1 text-xs text-gray-400">
                      Gestionar películas, cines, géneros y usuarios
                    </Text>
                  </View>
                  <View className="rounded-full bg-purple-600/20 p-2">
                    <ChevronRight size={16} color="#A855F7" />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
                activeOpacity={0.8}>
                <View className="flex-row items-center p-6">
                  <View className="mr-4 rounded-full bg-gray-700/50 p-3">
                    <Shield size={20} color="#9CA3AF" />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-sm font-medium text-gray-400">Permisos</Text>
                    <Text className="text-base font-medium text-white">
                      {usuario.rol_id === 1 ? 'Super Administrador' : 'Administrador'}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-400">
                      {usuario.rol_id === 1
                        ? 'Acceso total al sistema'
                        : 'Acceso completo al sistema'}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Configuración */}
          <Text className="mb-6 mt-8 text-xl font-bold text-white">Preferencias</Text>

          <ConfigItemRow
            title="Notificaciones"
            value={notifications}
            onToggle={setNotifications}
            preferenceKey="notifications"
          />

          <ConfigItemRow
            title="Modo oscuro"
            value={darkMode}
            onToggle={setDarkMode}
            preferenceKey="darkMode"
          />

          {/* Botón para editar perfil */}
          <TouchableOpacity
            className="mb-4 overflow-hidden rounded-3xl bg-blue-500/10"
            onPress={handleEditProfile}
            activeOpacity={0.8}>
            <View className="flex-row items-center p-6">
              <View className="mr-4 rounded-full bg-blue-600/30 p-3">
                <Edit3 size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-white">Editar Información</Text>
                <Text className="mt-1 text-xs text-gray-400">
                  Actualizar nombre, teléfono y otros datos
                </Text>
              </View>
              <ChevronRight size={20} color="#3B82F6" />
            </View>
          </TouchableOpacity>

          {/* Botón Cerrar Sesión */}
          <TouchableOpacity
            className="mb-8 mt-8 flex-row items-center justify-center rounded-3xl bg-red-500/10 p-6"
            onPress={handleLogout}
            activeOpacity={0.8}>
            <LogOut size={20} color="#EF4444" />
            <Text className="ml-3 text-base font-semibold text-red-400">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de edición de perfil */}
      <EditarPerfilModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleProfileSaved}
      />
    </View>
  );
}
