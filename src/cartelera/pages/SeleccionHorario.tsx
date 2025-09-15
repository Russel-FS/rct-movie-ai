import { Text, View } from 'react-native';

export default function SeleccionHorario() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Selección de horario</Text>
      <Text className="text-gray-300">Elige el horario que prefieras</Text>
    </View>
  );
}