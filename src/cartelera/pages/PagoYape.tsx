import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { ArrowLeft, Smartphone, QrCode } from 'lucide-react-native';

interface PagoYapeProps {
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
  onContinue?: (detallesPago: any) => void;
}

export default function PagoYape({
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
}: PagoYapeProps) {
  const [telefono, setTelefono] = useState('');
  const [codigoCompra, setCodigoCompra] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formatTelefono = (text: string) => {
    // Eliminar caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    // Limitar a 9 dígitos
    return cleaned.substring(0, 9);
  };

  const handleTelefonoChange = (text: string) => {
    setTelefono(formatTelefono(text));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!telefono || telefono.length !== 9) {
      newErrors.telefono = 'Ingresa un número de teléfono válido (9 dígitos)';
    }
    
    if (!codigoCompra || codigoCompra.length < 6) {
      newErrors.codigoCompra = 'Ingresa el código de compra';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm() && onContinue) {
      onContinue({
        telefono,
        codigoCompra
      });
    }
  };

  // Generar un código QR ficticio para la demostración
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YAPE_CINE_ESTELAR_' + totalPagar.toFixed(2);

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
            <Text className="text-white text-xl font-bold">Pago con Yape</Text>
            <Text className="text-gray-400 text-sm">Escanea el código QR con tu app</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Resumen de la compra */}
          <View className="bg-gray-900 rounded-xl p-4 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-400">Total a Pagar</Text>
              <Text className="text-white font-bold">S/ {(totalPagar || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* Código QR */}
          <View className="bg-gray-900 rounded-xl p-6 mb-6 items-center">
            <Text className="text-white text-lg font-bold mb-4">Escanea este código QR</Text>
            <View className="bg-white p-4 rounded-lg mb-4">
              <QrCode size={200} color="#000000" />
            </View>
            <Text className="text-gray-400 text-center">
              Abre tu app de Yape, escanea el código y completa el pago
            </Text>
          </View>

          {/* Formulario de confirmación */}
          <View className="bg-gray-900 rounded-xl p-4 mb-6">
            <Text className="text-white text-lg font-bold mb-4">Confirma tu pago</Text>
            
            <View className="mb-4">
              <Text className="text-white mb-2">Número de teléfono</Text>
              <View className="flex-row items-center bg-gray-800 rounded-lg px-4 py-3">
                <Smartphone size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Ingresa tu número de Yape"
                  placeholderTextColor="#6B7280"
                  value={telefono}
                  onChangeText={handleTelefonoChange}
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>
              {errors.telefono && (
                <Text className="text-red-500 mt-1">{errors.telefono}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2">Código de compra</Text>
              <View className="flex-row items-center bg-gray-800 rounded-lg px-4 py-3">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="Ingresa el código que recibiste en Yape"
                  placeholderTextColor="#6B7280"
                  value={codigoCompra}
                  onChangeText={setCodigoCompra}
                />
              </View>
              {errors.codigoCompra && (
                <Text className="text-red-500 mt-1">{errors.codigoCompra}</Text>
              )}
            </View>
          </View>

          <View className="bg-gray-900 rounded-xl p-4 mb-6">
            <Text className="text-white mb-2">Instrucciones</Text>
            <Text className="text-gray-400 text-sm mb-2">
              1. Escanea el código QR con tu app de Yape
            </Text>
            <Text className="text-gray-400 text-sm mb-2">
              2. Confirma el monto a pagar: S/ {(totalPagar || 0).toFixed(2)}
            </Text>
            <Text className="text-gray-400 text-sm mb-2">
              3. Completa el pago en tu app
            </Text>
            <Text className="text-gray-400 text-sm">
              4. Ingresa tu número y el código de compra para confirmar
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 bg-gray-900 border-t border-gray-800">
        <TouchableOpacity
          onPress={handleContinue}
          className="py-4 rounded-xl bg-blue-600"
        >
          <Text className="text-white font-bold text-center">
            Confirmar Pago
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}