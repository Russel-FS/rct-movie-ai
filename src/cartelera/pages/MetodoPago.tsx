import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CreditCard, Smartphone, ChevronRight, ArrowLeft } from 'lucide-react-native';
import PagoTarjeta from './PagoTarjeta';
import PagoYape from './PagoYape';

interface MetodoPagoProps {
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
  subtotalEntradas: number;
  subtotalComidas: number;
  totalPagar: number;
  onBack?: () => void;
  onContinue?: (metodoPago: string, detallesPago: any) => void;
}

export default function MetodoPago({
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
  onBack,
  onContinue
}: MetodoPagoProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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
    }
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentComplete = (detallesPago: any) => {
    if (selectedMethod && onContinue) {
      onContinue(selectedMethod, detallesPago);
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
      <View className="bg-gray-900 pb-6 pt-12 px-6 border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={onBack}
            className="bg-gray-800 rounded-full w-10 h-10 items-center justify-center mr-4"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">Método de Pago</Text>
            <Text className="text-gray-400 text-sm">Elige cómo quieres pagar</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Resumen de la compra */}
        <View className="p-6">
          <Text className="text-white text-lg font-bold mb-4">Resumen de la compra</Text>
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

            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Subtotal Entradas</Text>
                <Text className="text-white">S/ {(subtotalEntradas || 0).toFixed(2)}</Text>
              </View>
              <View key="subtotal-comidas" className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Subtotal Comidas</Text>
                <Text className="text-white">S/ {(subtotalComidas || 0).toFixed(2)}</Text>
              </View>
              <View key="total" className="flex-row justify-between mt-3">
                <Text className="text-white font-bold">Total a Pagar</Text>
                <Text className="text-white font-bold">S/ {(totalPagar || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Métodos de pago */}
          <Text className="text-white text-lg font-bold mb-4">Elige tu método de pago</Text>
          {metodoPago.map((metodo) => (
            <TouchableOpacity
              key={`metodo-${metodo.id}`}
              onPress={() => setSelectedMethod(metodo.id)}
              className={`mb-4 p-4 rounded-xl flex-row items-center ${
                selectedMethod === metodo.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-900'
              }`}
            >
              <View className="bg-gray-800/50 p-3 rounded-full mr-4">
                <metodo.icon size={24} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold">{metodo.nombre}</Text>
                <Text className="text-gray-400 text-sm">{metodo.descripcion}</Text>
              </View>
              {selectedMethod === metodo.id && (
                <View className="bg-white/20 rounded-full p-2">
                  <ChevronRight size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 bg-gray-900 border-t border-gray-800">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedMethod}
          className={`py-4 rounded-xl ${
            selectedMethod ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          <Text className="text-white font-bold text-center">
            Continuar al Pago
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}