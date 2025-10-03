import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Film } from 'lucide-react-native';
import { useTickets } from '~/shared/hooks/useTickets';
import { RootStackParamList } from '~/shared/types/navigation';
import QRCode from '~/shared/components/QRCode';

type MisEntradasNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MisEntradas() {
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
        {/* Header */}
        <View className="px-4 pb-6 pt-14">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-gray-400">Mis entradas</Text>
              <Text className="text-2xl font-bold text-white">Tus películas</Text>
            </View>
          </View>
        </View>

        {/* Estado vacío */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center rounded-3xl bg-gray-800/30 p-12">
            <Film size={64} color="#6B7280" />
            <Text className="mt-6 text-xl font-bold text-white">No tienes entradas</Text>
            <Text className="mt-3 text-center text-base leading-6 text-gray-400">
              Cuando compres entradas para películas aparecerán aquí
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pb-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-400">Mis entradas</Text>
            <Text className="text-2xl font-bold text-white">Tus películas</Text>
          </View>
          <View className="rounded-full bg-gray-800/50 px-3 py-1">
            <Text className="text-sm font-medium text-white">{tickets.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshTickets}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }>
        <View className="px-4 pb-8">
          {tickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              onPress={() => handleTicketPress(ticket.id)}
              className="mb-6 overflow-hidden rounded-3xl bg-gray-800/50"
              activeOpacity={0.8}>
              {/* Contenido del ticket */}
              <View className="p-6">
                {/* Header del ticket */}
                <View className="mb-6 flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="mb-3 flex-row items-center">
                      <MapPin size={18} color="#9CA3AF" />
                      <Text className="ml-3 text-xl font-bold text-white">{ticket.cinemaName}</Text>
                    </View>

                    <Text className="mb-4 text-lg font-medium text-gray-300">
                      {ticket.sala} • {ticket.formato}
                    </Text>

                    <View className="flex-row items-center space-x-6">
                      <View className="flex-row items-center">
                        <Calendar size={16} color="#9CA3AF" />
                        <Text className="ml-2 text-base font-medium text-gray-300">
                          {formatFecha(ticket.fecha)}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Clock size={16} color="#9CA3AF" />
                        <Text className="ml-2 text-base font-medium text-gray-300">
                          {ticket.hora}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <ChevronRight size={24} color="#6B7280" />
                </View>

                {/* Asientos */}
                <View className="mb-6 border-t border-gray-700 pt-4">
                  <Text className="mb-2 text-sm font-medium text-gray-400">
                    Asientos seleccionados
                  </Text>
                  <Text className="text-lg font-bold text-white">
                    {ticket.asientosSeleccionados.join(' • ')}
                  </Text>
                </View>

                {/* QR Code */}
                <View className="items-center border-t border-gray-700 pt-6">
                  <QRCode value={ticket.qrValue} size={140} />
                  <View className="mt-4 rounded-2xl bg-gray-700/50 px-4 py-2">
                    <Text className="text-center text-sm font-medium text-gray-300">
                      {ticket.codigoOperacion}
                    </Text>
                  </View>
                  <Text className="mt-2 text-center text-xs text-gray-500">
                    Presenta este código en el cine
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
