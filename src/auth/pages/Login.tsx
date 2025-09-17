import { Text, View } from 'react-native';

export default function Login() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Iniciar Sesión</Text>
      <Text className="text-gray-300">Página de inicio de sesión</Text>
    </View>
  );
}