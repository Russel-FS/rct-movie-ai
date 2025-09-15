import { Text, View } from 'react-native';

export default function SeleccionLugar() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Selección de lugar</Text>
      <Text className="text-gray-300">Selecciona el cine donde deseas ver la película</Text>
    </View>
  );
}