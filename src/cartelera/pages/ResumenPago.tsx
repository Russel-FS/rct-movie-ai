import { Text, View } from 'react-native';

export default function ResumenPago() {
  return (
    <View className="p-4 bg-gray-800 rounded-lg">
      <Text className="text-white text-lg font-semibold mb-4">Resumen de compra</Text>
      <Text className="text-gray-300">Revisa los detalles de tu compra antes de confirmar</Text>
    </View>
  );
}