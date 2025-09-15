import { Text, View } from 'react-native';

export default function SeleccionComidas() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Selección de comidas</Text>
      <Text className="text-gray-300">Añade snacks y bebidas a tu pedido</Text>
    </View>
  );
}