import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, Smartphone, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { RootStackParamList } from '~/shared/types/navigation';
import PagoTarjeta from './PagoTarjeta';
import PagoYape from './PagoYape';

type MetodoPagoRouteProp = RouteProp<RootStackParamList, 'MetodoPago'>;
type MetodoPagoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MetodoPago'>;

export default function MetodoPago() {
  const navigation = useNavigation<MetodoPagoNavigationProp>();
  const route = useRoute<MetodoPagoRouteProp>();
  const {
    peliculaId,
    cinemaName,
    fecha,
    hora,
    sala,
    formato,
    asientosSeleccionados,
    comidas,
    subtotalEntradas,
    subtotalComidas,
    totalPagar,
  } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleContinue = (metodoPago: string, detallesPago?: any) => {
    const codigoOperacion = Math.random().toString(36).substring(2, 10).toUpperCase();

    navigation.navigate('ResumenPago', {
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
      totalPagado: totalPagar,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const metodoPago = [
    {
      id: 'tarjeta',
      nombre: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      descripcion: 'Visa, Mastercard, American Express',
    },
    {
      id: 'yape',
      nombre: 'Yape',
      icon: Smartphone,
      descripcion: 'Paga escaneando el código QR',
    },
  ];

  const handleSelectMethod = () => {
    if (selectedMethod) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentComplete = (detallesPago: any) => {
    if (selectedMethod) {
      handleContinue(selectedMethod, detallesPago);
    }
  };

  const handleBackFromPaymentForm = () => {
    setShowPaymentForm(false);
  };

  // Renderizar el formulario de pago específico según el método seleccionado
  if (showPaymentForm) {
    if (selectedMethod === 'tarjeta') {
      return (
        <PagoTarjeta
          peliculaId={peliculaId}
          cinemaName={cinemaName}
          fecha={fecha}
          hora={hora}
          sala={sala}
          formato={formato}
          asientosSeleccionados={asientosSeleccionados}
          comidas={comidas}
          subtotalEntradas={subtotalEntradas}
          subtotalComidas={subtotalComidas}
          totalPagar={totalPagar}
          onBack={handleBackFromPaymentForm}
          onContinue={handlePaymentComplete}
        />
      );
    } else if (selectedMethod === 'yape') {
      return (
        <PagoYape
          peliculaId={peliculaId}
          cinemaName={cinemaName}
          fecha={fecha}
          hora={hora}
          sala={sala}
          formato={formato}
          asientosSeleccionados={asientosSeleccionados}
          comidas={comidas}
          subtotalEntradas={subtotalEntradas}
          subtotalComidas={subtotalComidas}
          totalPagar={totalPagar}
          onBack={handleBackFromPaymentForm}
          onContinue={handlePaymentComplete}
        />
      );
    }
  }

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
            <Text className="text-xl font-bold text-white">Método de Pago</Text>
            <Text className="text-sm text-gray-400">Elige cómo quieres pagar</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Resumen de la compra */}
        <View className="p-6">
          <Text className="mb-4 text-lg font-bold text-white">Resumen de la compra</Text>
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

            <View>
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Subtotal Entradas</Text>
                <Text className="text-white">S/ {(subtotalEntradas || 0).toFixed(2)}</Text>
              </View>
              <View key="subtotal-comidas" className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Subtotal Comidas</Text>
                <Text className="text-white">S/ {(subtotalComidas || 0).toFixed(2)}</Text>
              </View>
              <View key="total" className="mt-3 flex-row justify-between">
                <Text className="font-bold text-white">Total a Pagar</Text>
                <Text className="font-bold text-white">S/ {(totalPagar || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Métodos de pago */}
          <Text className="mb-4 text-lg font-bold text-white">Elige tu método de pago</Text>
          {metodoPago.map((metodo) => (
            <TouchableOpacity
              key={`metodo-${metodo.id}`}
              onPress={() => setSelectedMethod(metodo.id)}
              className={`mb-4 flex-row items-center rounded-xl p-4 ${
                selectedMethod === metodo.id ? 'bg-blue-600' : 'bg-gray-900'
              }`}>
              <View className="mr-4 rounded-full bg-gray-800/50 p-3">
                <metodo.icon size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-white">{metodo.nombre}</Text>
                <Text className="text-sm text-gray-400">{metodo.descripcion}</Text>
              </View>
              {selectedMethod === metodo.id && (
                <View className="rounded-full bg-white/20 p-2">
                  <ChevronRight size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800 bg-gray-900 px-6 py-4">
        <TouchableOpacity
          onPress={handleSelectMethod}
          disabled={!selectedMethod}
          className={`rounded-xl py-4 ${selectedMethod ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <Text className="text-center font-bold text-white">Continuar al Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
