import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { ArrowLeft, Download, Share2, Ticket } from 'lucide-react-native';

interface ResumenPagoProps {
  peliculaId: string;
  cinemaName: string;
  fecha: string;
  hora: string;
  sala: string;
  formato: string;
  asientosSeleccionados: string[];
  comidas?: {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
  metodoPago: string;
  codigoOperacion: string;
  subtotalEntradas: number;
  subtotalComidas: number;
  totalPagado: number;
  onBack?: () => void;
  onFinish?: () => void;
}

export default function ResumenPago({
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
  onBack,
  onFinish
}: ResumenPagoProps) {
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
      <View className="bg-gray-900 pb-6 pt-12 px-6 border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={onBack}
            className="bg-gray-800 rounded-full w-10 h-10 items-center justify-center mr-4"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">¡Compra Exitosa!</Text>
            <Text className="text-gray-400 text-sm">Resumen de tu compra</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Mensaje de éxito */}
          <View className="bg-green-600/20 p-4 rounded-xl mb-6">
            <Text className="text-green-400 text-center text-base font-bold mb-2">
              ¡Tu compra se realizó con éxito!
            </Text>
            <Text className="text-green-300 text-center text-sm">
              Tu código de operación es: {codigoOperacion}
            </Text>
          </View>

          {/* Detalles de la compra */}
          <View className="bg-gray-900 rounded-xl p-4 mb-6">
            <View className="border-b border-gray-800 pb-4 mb-4">
              <Text className="text-gray-400 text-sm">Cinema</Text>
              <Text className="text-white font-bold">{cinemaName}</Text>
              <Text className="text-gray-300 text-sm mt-1">
                {fecha} - {hora} • {sala} • {formato}
              </Text>
            </View>
            
            <View key="asientos" className="border-b border-gray-800 pb-4 mb-4">
              <Text className="text-gray-400 text-sm">Asientos</Text>
              <Text className="text-white font-bold">
                {asientosSeleccionados.join(', ')}
              </Text>
            </View>

            {comidas && comidas.length > 0 && (
              <View key="comidas" className="border-b border-gray-800 pb-4 mb-4">
                <Text className="text-gray-400 text-sm">Comidas y Bebidas</Text>
                {comidas.map(item => (
                  <View key={`comida-${item.id}`} className="flex-row justify-between mt-2">
                    <Text className="text-white">
                      {item.cantidad}x {item.nombre}
                    </Text>
                    <Text className="text-white">S/ {(item.precio || 0).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View key="totales" className="border-b border-gray-800 pb-4 mb-4">
              <View key="subtotal-entradas" className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Subtotal Entradas</Text>
                <Text className="text-white">S/ {(subtotalEntradas || 0).toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Subtotal Comidas</Text>
                <Text className="text-white">S/ {(subtotalComidas || 0).toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mt-3">
                <Text className="text-white font-bold">Total Pagado</Text>
                <Text className="text-white font-bold">S/ {(totalPagado || 0).toFixed(2)}</Text>
              </View>
            </View>

            <View>
              <Text className="text-gray-400 text-sm">Método de pago</Text>
              <Text className="text-white font-bold mt-1">{metodoPago}</Text>
            </View>
          </View>

          {/* Botones de acción */}
          <View className="space-y-4">
            <TouchableOpacity 
              className="bg-gray-900 px-6 py-4 rounded-xl flex-row items-center justify-center"
              onPress={handleShare}
            >
              <Share2 size={24} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-bold ml-2">Compartir tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-gray-900 px-6 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Download size={24} color="#FFFFFF" className="mr-2" />
              <Text className="text-white font-bold ml-2">Descargar tickets</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 bg-gray-900 border-t border-gray-800">
        <TouchableOpacity
          onPress={onFinish}
          className="bg-blue-600 py-4 rounded-xl flex-row items-center justify-center"
        >
          <Ticket size={24} color="#FFFFFF" />
          <Text className="text-white font-bold text-center ml-2">
            Ver mis entradas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}