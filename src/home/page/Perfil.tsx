import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { User, ChevronRight, Mail, Phone, Lock, Settings, LogOut } from 'lucide-react-native';

// Interfaz para los items del perfil
interface ProfileItem {
  id: string;
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}

export default function Perfil() {
  // Estados para los switches de configuración
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Datos del usuario
  const userInfo = {
    name: 'James Velezmoro',
    email: 'James.Velezmoro@email.com',
  };

  // Items de información personal
  const profileItems: ProfileItem[] = [
    {
      id: 'name',
      title: 'Nombre completo',
      value: 'James Velezmoro',
      icon: User,
    },
    {
      id: 'email',
      title: 'Email',
      value: 'James.Velezmoro@email.com',
      icon: Mail,
    },
    {
      id: 'phone',
      title: 'Teléfono',
      value: '+51 918477755',
      icon: Phone,
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
        onPress: () => {
          console.log('Cerrando sesión...');
        },
      },
    ]);
  };

  const ProfileItemRow: React.FC<{ item: ProfileItem }> = ({ item }) => (
    <TouchableOpacity
      className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      activeOpacity={0.8}>
      <View className="flex-row items-center p-6">
        <View className="mr-4 rounded-full bg-gray-700/50 p-3">
          <item.icon size={20} color="#9CA3AF" />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-sm font-medium text-gray-400">{item.title}</Text>
          <Text className="text-base font-medium text-white">{item.value}</Text>
        </View>
        <ChevronRight size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  const ConfigItemRow: React.FC<{
    title: string;
    value: boolean;
    onToggle: (value: boolean) => void;
  }> = ({ title, value, onToggle }) => (
    <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-6">
      <Text className="text-base font-medium text-white">{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
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
            <Text className="mb-1 text-xl font-bold text-white">{userInfo.name}</Text>
            <Text className="text-sm text-gray-400">{userInfo.email}</Text>
          </View>

          {/* Información Personal */}
          <Text className="mb-6 text-xl font-bold text-white">Información Personal</Text>

          {profileItems.map((item) => (
            <ProfileItemRow key={item.id} item={item} />
          ))}

          {/* Configuración */}
          <Text className="mb-6 mt-8 text-xl font-bold text-white">Preferencias</Text>

          <ConfigItemRow title="Notificaciones" value={notifications} onToggle={setNotifications} />

          <ConfigItemRow title="Modo oscuro" value={darkMode} onToggle={setDarkMode} />

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
    </View>
  );
}
