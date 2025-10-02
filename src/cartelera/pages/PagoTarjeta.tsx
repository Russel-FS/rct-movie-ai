import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronLeft, CreditCard, Lock, Shield } from 'lucide-react-native';

interface PagoTarjetaProps {
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

export default function PagoTarjeta({
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
}: PagoTarjetaProps) {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [nombreTitular, setNombreTitular] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatNumeroTarjeta = (text: string) => {
    // Eliminar espacios y caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    // Limitar a 16 dígitos
    const limited = cleaned.substring(0, 16);
    // Formatear con espacios cada 4 dígitos
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatFechaExpiracion = (text: string) => {
    // Eliminar caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    // Limitar a 4 dígitos
    const limited = cleaned.substring(0, 4);
    // Formatear como MM/YY
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
      <View className="border-b border-gray-800 bg-gray-900 px-6 pb-6 pt-12">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={onBack}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800">
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-white">Pago con Tarjeta</Text>
            <Text className="text-sm text-gray-400">Ingresa los datos de tu tarjeta</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Resumen de la compra */}
          <View className="mb-6 rounded-xl bg-gray-900 p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-gray-400">Total a Pagar</Text>
              <Text className="font-bold text-white">S/ {(totalPagar || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* Formulario de tarjeta */}
          <View className="mb-6 rounded-xl bg-gray-900 p-4">
            <View className="mb-4">
              <Text className="mb-2 text-white">Número de Tarjeta</Text>
              <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
                <CreditCard size={20} color="#9CA3AF" />
                <TextInput
                  className="ml-2 flex-1 text-white"
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#6B7280"
                  value={numeroTarjeta}
                  onChangeText={handleNumeroTarjetaChange}
                  keyboardType="numeric"
                  maxLength={19} // 16 dígitos + 3 espacios
                />
              </View>
              {errors.numeroTarjeta && (
                <Text className="mt-1 text-red-500">{errors.numeroTarjeta}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-white">Nombre del Titular</Text>
              <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
                <TextInput
                  className="flex-1 text-white"
                  placeholder="Como aparece en la tarjeta"
                  placeholderTextColor="#6B7280"
                  value={nombreTitular}
                  onChangeText={setNombreTitular}
                />
              </View>
              {errors.nombreTitular && (
                <Text className="mt-1 text-red-500">{errors.nombreTitular}</Text>
              )}
            </View>

            <View className="mb-4 flex-row">
              <View className="mr-2 flex-1">
                <Text className="mb-2 text-white">Fecha de Expiración</Text>
                <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
                  <TextInput
                    className="flex-1 text-white"
                    placeholder="MM/YY"
                    placeholderTextColor="#6B7280"
                    value={fechaExpiracion}
                    onChangeText={handleFechaExpiracionChange}
                    keyboardType="numeric"
                    maxLength={5} // MM/YY
                  />
                </View>
                {errors.fechaExpiracion && (
                  <Text className="mt-1 text-red-500">{errors.fechaExpiracion}</Text>
                )}
              </View>

              <View className="ml-2 flex-1">
                <Text className="mb-2 text-white">CVV</Text>
                <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    className="ml-2 flex-1 text-white"
                    placeholder="123"
                    placeholderTextColor="#6B7280"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                {errors.cvv && <Text className="mt-1 text-red-500">{errors.cvv}</Text>}
              </View>
            </View>
          </View>

          <View className="mb-6 rounded-xl bg-gray-900 p-4">
            <Text className="mb-2 text-white">Información de Seguridad</Text>
            <Text className="text-sm text-gray-400">
              Tus datos de pago están protegidos con encriptación de 256 bits. No almacenamos los
              datos completos de tu tarjeta.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800 bg-gray-900 px-6 py-4">
        <TouchableOpacity onPress={handleContinue} className="rounded-xl bg-blue-600 py-4">
          <Text className="text-center font-bold text-white">
            Pagar S/ {(totalPagar || 0).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
