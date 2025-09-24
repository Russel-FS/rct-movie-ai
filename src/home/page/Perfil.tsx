import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert 
} from 'react-native';
import { 
  User, 
  ChevronRight, 
  Mail, 
  Phone, 
  Lock 
} from 'lucide-react-native';

// Interfaz para los items del perfil
interface ProfileItem {
  id: string;
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}

// Interfaz para los items de configuración con switch
interface ConfigItem {
  id: string;
  title: string;
  enabled: boolean;
}

export default function Perfil() {
  // Estados para los switches de configuración
  const [notifications, setNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Datos del usuario
  const userInfo = {
    name: 'James Velezmoro',
    email: 'James.Velezmoro@email.com'
  };

  // Items de información personal
  const profileItems: ProfileItem[] = [
    {
      id: 'name',
      title: 'Nombre completo',
      value: 'James Velezmoro',
      icon: User
    },
    {
      id: 'email',
      title: 'Email',
      value: 'James.Velezmoro@email.com',
      icon: Mail
    },
    {
      id: 'phone',
      title: 'Teléfono',
      value: '+51 918477755',
      icon: Phone
    },
    {
      id: 'password',
      title: 'Contraseña',
      value: '••••••••',
      icon: Lock
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            // Aquí iría la lógica para cerrar sesión
            console.log('Cerrando sesión...');
          },
        },
      ],
    );
  };

  const ProfileItemRow: React.FC<{ item: ProfileItem }> = ({ item }) => (
    <TouchableOpacity className="bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <View className="bg-gray-700 p-2 rounded-lg mr-3">
          <item.icon size={20} color="#9CA3AF" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-400 text-sm mb-1">{item.title}</Text>
          <Text className="text-white text-base">{item.value}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  const ConfigItemRow: React.FC<{ 
    title: string; 
    value: boolean; 
    onToggle: (value: boolean) => void; 
  }> = ({ title, value, onToggle }) => (
    <View className="bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between">
      <Text className="text-white text-base">{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#374151', true: '#3B82F6' }}
        thumbColor={value ? '#FFFFFF' : '#9CA3AF'}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-14 px-4 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">Mi Perfil</Text>
            <TouchableOpacity>
              <Text className="text-blue-500 text-base font-medium">Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar y nombre del usuario */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-gray-700 rounded-full items-center justify-center mb-4">
              <User size={32} color="#9CA3AF" />
            </View>
            <Text className="text-white text-xl font-bold mb-1">{userInfo.name}</Text>
            <Text className="text-gray-400 text-sm">{userInfo.email}</Text>
          </View>
        </View>

        <View className="px-4">
          {/* Información Personal */}
          <Text className="text-white text-lg font-semibold mb-4">Información Personal</Text>
          
          {profileItems.map((item) => (
            <ProfileItemRow key={item.id} item={item} />
          ))}

          {/* Configuración */}
          <Text className="text-white text-lg font-semibold mb-4 mt-6">Configuración</Text>
          
          <ConfigItemRow
            title="Notificaciones"
            value={notifications}
            onToggle={setNotifications}
          />
          
          <ConfigItemRow
            title="Modo oscuro"
            value={darkMode}
            onToggle={setDarkMode}
          />

          {/* Botón Cerrar Sesión */}
          <TouchableOpacity
            className="bg-red-600 rounded-lg p-4 mt-8 mb-8 items-center"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-semibold">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}