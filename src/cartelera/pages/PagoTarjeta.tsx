import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronLeft, CreditCard, Lock, Shield } from 'lucide-react-native';

interface PagoTarjetaProps {
  totalPagar: number;
  onBack?: () => void;
  onContinue?: (detallesPago: any) => void;
}

export default function PagoTarjeta({ totalPagar, onBack, onContinue }: PagoTarjetaProps) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatNumeroTarjeta = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.substring(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatFechaExpiracion = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.substring(0, 4);
    if (limited.length > 2) {
      return `${limited.substring(0, 2)}/${limited.substring(2)}`;
    }
    return limited;
  };

  const handleNumeroTarjetaChange = (text: string) => {
    setNumeroTarjeta(formatNumeroTarjeta(text));
  };

  const handleFechaExpiracionChange = (text: string) => {
    setFechaExpiracion(formatFechaExpiracion(text));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!numeroTarjeta || numeroTarjeta.replace(/\s/g, '').length < 16) {
      newErrors.numeroTarjeta = 'Ingresa un número de tarjeta válido';
    }

    if (!nombreTitular) {
      newErrors.nombreTitular = 'Ingresa el nombre del titular';
    }

    if (!fechaExpiracion || fechaExpiracion.length < 5) {
      newErrors.fechaExpiracion = 'Ingresa una fecha válida (MM/YY)';
    }

    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'Ingresa un CVV válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm() && onContinue) {
      onContinue({
        numeroTarjeta,
        nombreTitular,
        fechaExpiracion,
        cvv,
      });
    }
  };

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
              <Text className="text-sm font-medium text-gray-400">Pago con tarjeta</Text>
              <Text className="text-2xl font-bold text-white">Datos de tu tarjeta</Text>
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

        {/* Formulario de tarjeta */}
        <View className="px-4">
          <Text className="mb-6 text-2xl font-bold text-white">Datos de la Tarjeta</Text>

          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-white">Número de Tarjeta</Text>
            <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-6 py-4">
              <CreditCard size={20} color="#9CA3AF" />
              <TextInput
                className="ml-3 flex-1 text-lg text-white"
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#6B7280"
                value={numeroTarjeta}
                onChangeText={handleNumeroTarjetaChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
            {errors.numeroTarjeta && (
              <Text className="mt-2 text-sm text-red-400">{errors.numeroTarjeta}</Text>
            )}
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-base font-medium text-white">Nombre del Titular</Text>
            <View className="rounded-3xl bg-gray-800/50 px-6 py-4">
              <TextInput
                className="text-lg text-white"
                placeholder="Como aparece en la tarjeta"
                placeholderTextColor="#6B7280"
                value={nombreTitular}
                onChangeText={setNombreTitular}
              />
            </View>
            {errors.nombreTitular && (
              <Text className="mt-2 text-sm text-red-400">{errors.nombreTitular}</Text>
            )}
          </View>

          <View className="mb-6 flex-row space-x-4">
            <View className="flex-1">
              <Text className="mb-3 text-base font-medium text-white">Fecha de Expiración</Text>
              <View className="rounded-3xl bg-gray-800/50 px-6 py-4">
                <TextInput
                  className="text-lg text-white"
                  placeholder="MM/YY"
                  placeholderTextColor="#6B7280"
                  value={fechaExpiracion}
                  onChangeText={handleFechaExpiracionChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              {errors.fechaExpiracion && (
                <Text className="mt-2 text-sm text-red-400">{errors.fechaExpiracion}</Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="mb-3 text-base font-medium text-white">CVV</Text>
              <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-6 py-4">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  className="ml-3 flex-1 text-lg text-white"
                  placeholder="123"
                  placeholderTextColor="#6B7280"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
              {errors.cvv && <Text className="mt-2 text-sm text-red-400">{errors.cvv}</Text>}
            </View>
          </View>
        </View>

        {/* Información de seguridad */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <View className="mb-3 flex-row items-center">
              <Shield size={20} color="#10B981" />
              <Text className="ml-3 text-lg font-bold text-white">Pago Seguro</Text>
            </View>
            <Text className="text-base leading-6 text-gray-300">
              Tus datos están protegidos con encriptación de 256 bits. No almacenamos información
              completa de tu tarjeta.
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
          <Text className="text-center text-lg font-bold text-black">
            Pagar S/ {(totalPagar || 0).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
