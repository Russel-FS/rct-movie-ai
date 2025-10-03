import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ticket, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { useTickets } from '~/shared/hooks/useTickets';
import { RootStackParamList } from '~/shared/types/navigation';
import QRCode from '~/shared/components/QRCode';

type MisEntradasNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MisEntradas() {
  const navigation = useNavigation<MisEntradasNavigationProp>();
  const { tickets, loading, refreshTickets } = useTickets();

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const handleTicketPress = (ticketId: string) => {
    console.log('Ver ticket:', ticketId);
  };

  if (tickets.length === 0 && !loading) {
    return (
      <View className="flex-1 bg-black">
        <View className="px-4 pb-6 pt-14">
          <Text className="text-2xl font-bold text-white">Mis Entradas</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Ticket size={64} color="#6B7280" />
          <Text className="mt-4 text-xl font-bold text-white">No tienes entradas</Text>
          <Text className="mt-2 text-center text-base text-gray-400">
            Cuando compres entradas aparecerán aquí
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pb-6 pt-14">
        <Text className="text-2xl font-bold text-white">Mis Entradas</Text>
        <Text className="mt-1 text-sm text-gray-400">{tickets.length} entrada(s)</Text>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshTickets}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }>
        <View className="px-4 pb-8">
          {tickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              onPress={() => handleTicketPress(ticket.id)}
              className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
              activeOpacity={0.8}>
              {/* Header del ticket */}
              <View className="p-6">
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="mb-2 flex-row items-center">
                      <MapPin size={16} color="#9CA3AF" />
                      <Text className="ml-2 text-lg font-bold text-white">{ticket.cinemaName}</Text>
                    </View>

                    <Text className="mb-3 text-base text-gray-300">
                      {ticket.sala} • {ticket.formato}
                    </Text>

                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center">
                        <Calendar size={14} color="#9CA3AF" />
                        <Text className="ml-1 text-sm text-gray-300">
                          {formatFecha(ticket.fecha)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Clock size={14} color="#9CA3AF" />
                        <Text className="ml-1 text-sm text-gray-300">{ticket.hora}</Text>
                      </View>
                    </View>
                  </View>

                  <ChevronRight size={20} color="#9CA3AF" />
                </View>

                {/* Asientos */}
                <View className="mb-4 border-t border-gray-700 pt-4">
                  <Text className="mb-1 text-sm text-gray-400">Asientos</Text>
                  <Text className="text-base font-medium text-white">
                    {ticket.asientosSeleccionados.join(', ')}
                  </Text>
                </View>

                {/* QR Code pequeño */}
                <View className="items-center border-t border-gray-700 pt-4">
                  <QRCode value={ticket.qrValue} size={120} />
                  <Text className="mt-2 text-xs text-gray-400">
                    Código: {ticket.codigoOperacion}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
