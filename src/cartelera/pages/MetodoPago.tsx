import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreditCard, Smartphone, ChevronLeft, MapPin, Clock, Calendar } from 'lucide-react-native';
import { RootStackParamList } from '~/shared/types/navigation';
import { useReserva } from '~/shared/hooks/useReserva';
import { useAuth } from '~/shared/contexts/AuthContext';
import PagoTarjeta from './PagoTarjeta';
import PagoYape from './PagoYape';

type MetodoPagoRouteProp = RouteProp<RootStackParamList, 'MetodoPago'>;
type MetodoPagoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MetodoPago'>;

function MetodoPagoContent() {
  const navigation = useNavigation<MetodoPagoNavigationProp>();
  const route = useRoute<MetodoPagoRouteProp>();
  const {
    funcionId,
    peliculaId,
    salaId,
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

  // Hook para procesar reservas
  const { procesarCompra, loading: procesandoCompra } = useReserva();

  // Contexto de usuario
  const { usuario } = useAuth();

  const procesarPagoYGuardar = async (metodoPago: string, detallesPago?: any) => {
    try {
      const datosCompra = {
        funcionId,
        salaId,
        asientosSeleccionados,
        comidas: comidas || [],
        metodoPago,
        subtotalEntradas: subtotalEntradas || 0,
        subtotalComidas: subtotalComidas || 0,
        totalPagado: totalPagar || 0,
      };

      const resultado = await procesarCompra(datosCompra, usuario?.id);

      if (resultado.success && resultado.reserva) {
        navigation.navigate('ResumenPago', {
          funcionId,
          peliculaId,
          cinemaName,
          fecha,
          hora,
          sala,
          formato,
          asientosSeleccionados,
          comidas: comidas || [],
          metodoPago,
          codigoOperacion: resultado.codigoOperacion || resultado.reserva.codigo_reserva,
          subtotalEntradas: subtotalEntradas || 0,
          subtotalComidas: subtotalComidas || 0,
          totalPagado: totalPagar || 0,
          reservaId: resultado.reserva.id,
        });
      } else {
        Alert.alert(
          'Error en el Pago',
          resultado.error || 'No se pudo procesar la compra. Intenta nuevamente.',
          [
            {
              text: 'Reintentar',
              onPress: () => setShowPaymentForm(false),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => {
                setShowPaymentForm(false);
                setSelectedMethod(null);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error Crítico',
        'Hubo un problema grave al procesar tu pago. Por favor, contacta con soporte si el problema persiste.',
        [
          {
            text: 'Reintentar',
            onPress: () => setShowPaymentForm(false),
          },
          {
            text: 'Volver',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
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

  const handlePaymentComplete = async (detallesPago: any) => {
    if (selectedMethod) {
      await procesarPagoYGuardar(selectedMethod, detallesPago);
    }
  };

  const handleBackFromPaymentForm = () => {
    setShowPaymentForm(false);
  };

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return '';

    if (fechaStr.includes('/') || fechaStr.includes('-')) {
      try {
        const fecha = new Date(fechaStr);

        if (isNaN(fecha.getTime())) {
          return fechaStr;
        }
        return fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      } catch (error) {
        return fechaStr;
      }
    }

    return fechaStr;
  };

  // Renderizar el formulario de pago específico según el método seleccionado
  if (showPaymentForm) {
    if (selectedMethod === 'tarjeta') {
      return (
        <PagoTarjeta
          totalPagar={totalPagar}
          onBack={handleBackFromPaymentForm}
          onContinue={handlePaymentComplete}
        />
      );
    } else if (selectedMethod === 'yape') {
      return (
        <PagoYape
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
      <View className="px-4 pb-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleBack}
              className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800/50"
              activeOpacity={0.7}>
              <ChevronLeft size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View>
              <Text className="text-sm font-medium text-gray-400">Método de pago</Text>
              <Text className="text-2xl font-bold text-white">¿Cómo quieres pagar?</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Resumen de la compra */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <Text className="mb-4 text-xl font-bold text-white">Resumen de Compra</Text>

            <View className="mb-4 flex-row items-center">
              <MapPin size={16} color="#9CA3AF" />
              <Text className="ml-2 text-lg font-bold text-white">{cinemaName}</Text>
            </View>

            <Text className="mb-4 text-base font-medium text-white">
              {sala} • {formato}
            </Text>

            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="ml-2 text-base font-medium text-white">{formatFecha(fecha)}</Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-base font-medium text-white">{hora}</Text>
              </View>
            </View>

            <View className="mb-4 border-t border-gray-700 pt-4">
              <Text className="mb-2 text-sm font-medium text-gray-400">Asientos seleccionados</Text>
              <Text className="text-base font-medium text-white">
                {asientosSeleccionados.join(', ')}
              </Text>
            </View>

            {comidas && comidas.length > 0 && (
              <View className="mb-4 border-t border-gray-700 pt-4">
                <Text className="mb-3 text-sm font-medium text-gray-400">Dulcería</Text>
                {comidas.map((item) => (
                  <View key={`comida-${item.id}`} className="mb-2 flex-row justify-between">
                    <Text className="text-white">
                      {item.cantidad}x {item.nombre}
                    </Text>
                    <Text className="text-white">S/ {(item.precio || 0).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View className="border-t border-gray-700 pt-4">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-300">Entradas</Text>
                <Text className="text-white">S/ {(subtotalEntradas || 0).toFixed(2)}</Text>
              </View>
              <View className="mb-4 flex-row justify-between">
                <Text className="text-gray-300">Dulcería</Text>
                <Text className="text-white">S/ {(subtotalComidas || 0).toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xl font-bold text-white">Total</Text>
                <Text className="text-xl font-bold text-white">
                  S/ {(totalPagar || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Métodos de pago */}
        <View className="px-4">
          <Text className="mb-6 text-2xl font-bold text-white">Métodos de Pago</Text>
          {metodoPago.map((metodo) => (
            <TouchableOpacity
              key={`metodo-${metodo.id}`}
              onPress={() => setSelectedMethod(metodo.id)}
              className={`mb-4 overflow-hidden rounded-3xl ${
                selectedMethod === metodo.id ? 'bg-white' : 'bg-gray-800/50'
              }`}
              activeOpacity={0.8}>
              <View className="flex-row items-center p-6">
                <View
                  className={`mr-4 rounded-full p-3 ${
                    selectedMethod === metodo.id ? 'bg-gray-100' : 'bg-gray-700/50'
                  }`}>
                  <metodo.icon size={24} color={selectedMethod === metodo.id ? '#000' : '#FFF'} />
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-lg font-bold ${
                      selectedMethod === metodo.id ? 'text-black' : 'text-white'
                    }`}>
                    {metodo.nombre}
                  </Text>
                  <Text
                    className={`text-sm ${
                      selectedMethod === metodo.id ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                    {metodo.descripcion}
                  </Text>
                </View>
                {selectedMethod === metodo.id && (
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-black">
                    <Text className="text-sm font-bold text-white">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        {selectedMethod ? (
          <TouchableOpacity
            className={`rounded-full px-6 py-4 ${procesandoCompra ? 'bg-gray-400' : 'bg-white'}`}
            onPress={handleSelectMethod}
            disabled={procesandoCompra}
            activeOpacity={0.8}>
            <Text
              className={`text-center text-lg font-bold ${procesandoCompra ? 'text-gray-600' : 'text-black'}`}>
              {procesandoCompra
                ? 'Procesando...'
                : `Continuar con ${metodoPago.find((m) => m.id === selectedMethod)?.nombre}`}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="rounded-full bg-gray-800/50 px-6 py-4">
            <Text className="text-center text-lg font-medium text-gray-400">
              Selecciona un método de pago
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function MetodoPago() {
  return <MetodoPagoContent />;
}
