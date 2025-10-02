import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Download, Share2, Ticket } from 'lucide-react-native';
import { RootStackParamList } from '~/shared/types/navigation';

type ResumenPagoRouteProp = RouteProp<RootStackParamList, 'ResumenPago'>;
type ResumenPagoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumenPago'>;

export default function ResumenPago() {
  const navigation = useNavigation<ResumenPagoNavigationProp>();
  const route = useRoute<ResumenPagoRouteProp>();
  const {
    peliculaId,
    cinemaName,
    fecha,
    hora,
    sala,
    formato,
    asientosSeleccionados,
    comidas,
    metodoPago,
    codigoOperacion,
    subtotalEntradas,
    subtotalComidas,
    totalPagado,
  } = route.params;

  const handleFinish = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Compra realizada con éxito!\n\nCine: ${cinemaName}\nFecha: ${fecha}\nHora: ${hora}\nSala: ${sala}\nAsientos: ${asientosSeleccionados.join(', ')}\n\nCódigo de operación: ${codigoOperacion}`,
        title: 'Tickets de Cine',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="border-b border-gray-800 bg-gray-900 px-6 pb-6 pt-12">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">¡Compra Exitosa!</Text>
            <Text className="text-sm text-gray-400">Resumen de tu compra</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Mensaje de éxito */}
          <View className="mb-6 rounded-xl bg-green-600/20 p-4">
            <Text className="mb-2 text-center text-base font-bold text-green-400">
              ¡Tu compra se realizó con éxito!
            </Text>
            <Text className="text-center text-sm text-green-300">
              Tu código de operación es: {codigoOperacion}
            </Text>
          </View>

          {/* Detalles de la compra */}
          <View className="mb-6 rounded-xl bg-gray-900 p-4">
            <View className="mb-4 border-b border-gray-800 pb-4">
              <Text className="text-sm text-gray-400">Cinema</Text>
              <Text className="font-bold text-white">{cinemaName}</Text>
              <Text className="mt-1 text-sm text-gray-300">
                {fecha} - {hora} • {sala} • {formato}
              </Text>
            </View>

            <View key="asientos" className="mb-4 border-b border-gray-800 pb-4">
              <Text className="text-sm text-gray-400">Asientos</Text>
              <Text className="font-bold text-white">{asientosSeleccionados.join(', ')}</Text>
            </View>

            {comidas && comidas.length > 0 && (
              <View key="comidas" className="mb-4 border-b border-gray-800 pb-4">
                <Text className="text-sm text-gray-400">Comidas y Bebidas</Text>
                {comidas.map((item) => (
                  <View key={`comida-${item.id}`} className="mt-2 flex-row justify-between">
                    <Text className="text-white">
                      {item.cantidad}x {item.nombre}
                    </Text>
                    <Text className="text-white">S/ {(item.precio || 0).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View key="totales" className="mb-4 border-b border-gray-800 pb-4">
              <View key="subtotal-entradas" className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Subtotal Entradas</Text>
                <Text className="text-white">S/ {(subtotalEntradas || 0).toFixed(2)}</Text>
              </View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Subtotal Comidas</Text>
                <Text className="text-white">S/ {(subtotalComidas || 0).toFixed(2)}</Text>
              </View>
              <View className="mt-3 flex-row justify-between">
                <Text className="font-bold text-white">Total Pagado</Text>
                <Text className="font-bold text-white">S/ {(totalPagado || 0).toFixed(2)}</Text>
              </View>
            </View>

            <View>
              <Text className="text-sm text-gray-400">Método de pago</Text>
              <Text className="mt-1 font-bold text-white">{metodoPago}</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View className="space-y-4">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-xl bg-gray-900 px-6 py-4"
              onPress={handleShare}>
              <Share2 size={24} color="#FFFFFF" className="mr-2" />
              <Text className="ml-2 font-bold text-white">Compartir tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center rounded-xl bg-gray-900 px-6 py-4">
              <Download size={24} color="#FFFFFF" className="mr-2" />
              <Text className="ml-2 font-bold text-white">Descargar tickets</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800 bg-gray-900 px-6 py-4">
        <TouchableOpacity
          onPress={handleFinish}
          className="flex-row items-center justify-center rounded-xl bg-blue-600 py-4">
          <Ticket size={24} color="#FFFFFF" />
          <Text className="ml-2 text-center font-bold text-white">Ver mis entradas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
