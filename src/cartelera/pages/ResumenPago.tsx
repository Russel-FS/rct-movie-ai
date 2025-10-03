import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Download,
  Share2,
  Ticket,
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  QrCode,
} from 'lucide-react-native';
import { RootStackParamList } from '~/shared/types/navigation';
import QRCode from '~/shared/components/QRCode';
import { useTickets } from '~/shared/hooks/useTickets';
import { useEffect, useState } from 'react';

type ResumenPagoRouteProp = RouteProp<RootStackParamList, 'ResumenPago'>;
type ResumenPagoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumenPago'>;

export default function ResumenPago() {
  const navigation = useNavigation<ResumenPagoNavigationProp>();
  const route = useRoute<ResumenPagoRouteProp>();
  const { saveTicket } = useTickets();
  const [qrValue, setQrValue] = useState<string>('');
  const [ticketSaved, setTicketSaved] = useState(false);

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

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  // Guardar el ticket
  useEffect(() => {
    const saveTicketToStorage = async () => {
      if (!ticketSaved) {
        try {
          const ticket = await saveTicket({
            codigoOperacion,
            peliculaId,
            cinemaName,
            fecha,
            hora,
            sala,
            formato,
            asientosSeleccionados,
            comidas,
            metodoPago,
            subtotalEntradas,
            subtotalComidas,
            totalPagado,
          });

          setQrValue(ticket.qrValue);
          setTicketSaved(true);
        } catch (error) {
          console.error('Error al guardar el ticket:', error);
        }
      }
    };

    saveTicketToStorage();
  }, [
    saveTicket,
    ticketSaved,
    codigoOperacion,
    peliculaId,
    cinemaName,
    fecha,
    hora,
    sala,
    formato,
    asientosSeleccionados,
    comidas,
    metodoPago,
    subtotalEntradas,
    subtotalComidas,
    totalPagado,
  ]);

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
              <Text className="text-sm font-medium text-gray-400">Compra exitosa</Text>
              <Text className="text-2xl font-bold text-white">¡Todo listo!</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Mensaje de éxito */}
        <View className="mx-4 mb-8">
          <View className="items-center rounded-3xl bg-green-500/10 p-8">
            <CheckCircle size={64} color="#10B981" />
            <Text className="mb-2 mt-4 text-center text-2xl font-bold text-white">
              ¡Pago Exitoso!
            </Text>
            <Text className="mb-4 text-center text-base text-gray-300">
              Tu compra se realizó correctamente
            </Text>
            <View className="rounded-2xl bg-gray-800/50 px-6 py-3">
              <Text className="text-center text-sm font-medium text-gray-400">
                Código de operación
              </Text>
              <Text className="text-center text-lg font-bold text-white">{codigoOperacion}</Text>
            </View>
          </View>
        </View>

        {/* Detalles de la compra */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <Text className="mb-6 text-xl font-bold text-white">Resumen de Compra</Text>

            <View className="mb-6 flex-row items-center">
              <MapPin size={16} color="#9CA3AF" />
              <Text className="ml-2 text-lg font-bold text-white">{cinemaName}</Text>
            </View>

            <Text className="mb-4 text-base font-medium text-white">
              {sala} • {formato}
            </Text>

            <View className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="ml-2 text-base font-medium text-white">{formatFecha(fecha)}</Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-base font-medium text-white">{hora}</Text>
              </View>
            </View>

            <View className="mb-6 border-t border-gray-700 pt-4">
              <Text className="mb-2 text-sm font-medium text-gray-400">Asientos seleccionados</Text>
              <Text className="text-base font-medium text-white">
                {asientosSeleccionados.join(', ')}
              </Text>
            </View>

            {comidas && comidas.length > 0 && (
              <View className="mb-6 border-t border-gray-700 pt-4">
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
              <View className="mb-4 flex-row justify-between">
                <Text className="text-xl font-bold text-white">Total Pagado</Text>
                <Text className="text-xl font-bold text-white">
                  S/ {(totalPagado || 0).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm font-medium text-gray-400">Método de pago</Text>
                <Text className="text-sm font-medium text-white">{metodoPago}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Código QR para entrada */}
        <View className="mx-4 mb-8">
          <View className="items-center rounded-3xl bg-gray-800/50 p-8">
            <View className="mb-4 flex-row items-center">
              <QrCode size={24} color="#9CA3AF" />
              <Text className="ml-3 text-xl font-bold text-white">Tu Entrada Digital</Text>
            </View>

            <QRCode
              value={
                qrValue ||
                `CINE_TICKET_${codigoOperacion}_${cinemaName}_${fecha}_${hora}_${asientosSeleccionados.join('-')}`
              }
              size={180}
            />

            <Text className="mt-4 text-center text-sm text-gray-400">
              Presenta este código QR en el cine para ingresar
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View className="gap-2 space-y-4 px-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-3xl bg-gray-800/50 px-6 py-4"
            onPress={handleShare}
            activeOpacity={0.8}>
            <Share2 size={20} color="#FFFFFF" />
            <Text className="ml-3 text-base font-semibold text-white">Compartir tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center rounded-3xl bg-gray-800/50 px-6 py-4"
            activeOpacity={0.8}>
            <Download size={20} color="#FFFFFF" />
            <Text className="ml-3 text-base font-semibold text-white">Descargar tickets</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        <TouchableOpacity
          onPress={handleFinish}
          className="flex-row items-center justify-center rounded-full bg-white px-6 py-4"
          activeOpacity={0.8}>
          <Ticket size={20} color="#000" />
          <Text className="ml-3 text-lg font-bold text-black">Ver mis entradas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
