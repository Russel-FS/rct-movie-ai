import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';

export default function UsuarioCRUD() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-4">
      <Users size={64} color="#8B5CF6" />
      <Text className="mb-2 mt-4 text-xl font-bold text-white">Gestión de Usuarios</Text>
      <Text className="text-center text-gray-400">
        Funcionalidad en desarrollo.{'\n'}
        Aquí podrás gestionar usuarios, roles y permisos.
      </Text>
    </View>
  );
}
