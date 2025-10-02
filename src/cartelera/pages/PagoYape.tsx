import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronLeft, Smartphone, Shield } from 'lucide-react-native';

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
  onContinue,
}: PagoYapeProps) {
  const [telefono, setTelefono] = useState('');
  const [codigoCompra, setCodigoCompra] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      newErrors.codigoCompra = 'Ingresa un código de compra válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm() && onContinue) {
      onContinue({
        telefono,
        codigoCompra,
      });
    }
  };

  // Generar un código QR ficticio para la demostración
  const qrCodeUrl =
    'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YAPE_CINE_ESTELAR_' +
    totalPagar.toFixed(2);

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pb-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={onBack}
              className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800/50"
              activeOpacity={0.7}>
              <ChevronLeft size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View>
              <Text className="text-sm font-medium text-gray-400">Pago con Yape</Text>
              <Text className="text-2xl font-bold text-white">Escanea y paga</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Total a pagar */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <Text className="mb-2 text-lg font-bold text-white">Total a Pagar</Text>
            <Text className="text-3xl font-bold text-white">S/ {(totalPagar || 0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Formulario de pago */}
        <View className="px-4">
          <Text className="mb-4 text-2xl font-bold text-white">Datos de Yape</Text>
          <Text className="mb-6 text-base text-gray-400">
            Ingresa tu número de Yape y el código de compra para procesar el pago:
          </Text>

          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-white">Número de teléfono</Text>
            <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-6 py-4">
              <Smartphone size={20} color="#9CA3AF" />
              <TextInput
                className="ml-3 flex-1 text-lg text-white"
                placeholder="Número registrado en Yape"
                placeholderTextColor="#6B7280"
                value={telefono}
                onChangeText={handleTelefonoChange}
                keyboardType="numeric"
                maxLength={9}
              />
            </View>
            {errors.telefono && (
              <Text className="mt-2 text-sm text-red-400">{errors.telefono}</Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="mb-3 text-base font-medium text-white">Código de compra</Text>
            <View className="rounded-3xl bg-gray-800/50 px-6 py-4">
              <TextInput
                className="text-lg text-white"
                placeholder="Código de compra de Yape"
                placeholderTextColor="#6B7280"
                value={codigoCompra}
                onChangeText={setCodigoCompra}
              />
            </View>
            {errors.codigoCompra && (
              <Text className="mt-2 text-sm text-red-400">{errors.codigoCompra}</Text>
            )}
          </View>
        </View>

        {/* Instrucciones */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <View className="mb-4 flex-row items-center">
              <Shield size={20} color="#10B981" />
              <Text className="ml-3 text-lg font-bold text-white">Información de Pago</Text>
            </View>
            <Text className="mb-3 text-base text-gray-300">
              • Ingresa tu número de teléfono registrado en Yape
            </Text>
            <Text className="mb-3 text-base text-gray-300">
              • Proporciona el código de compra válido
            </Text>
            <Text className="text-base text-gray-300">
              • El pago se procesará automáticamente por S/ {(totalPagar || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-full bg-white px-6 py-4"
          activeOpacity={0.8}>
          <Text className="text-center text-lg font-bold text-black">Confirmar Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
