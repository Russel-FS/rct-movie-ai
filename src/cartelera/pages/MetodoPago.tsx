import { Text, View, TouchableOpacity } from 'react-native';
import { CreditCard, Smartphone } from 'lucide-react-native';

export default function MetodoPago() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Método de pago</Text>
      <View className="space-y-2">
        <TouchableOpacity className="p-3 bg-gray-700 rounded-md flex-row items-center">
          <CreditCard size={24} color="white" />
          <Text className="text-white ml-2">Tarjeta</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-gray-700 rounded-md flex-row items-center">
          <Smartphone size={24} color="white" />
          <Text className="text-white ml-2">Yape</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}