import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/types/navigation';
import {
  ChevronLeft,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Users,
  Film,
} from 'lucide-react-native';
import { FuncionService } from '~/shared/services/funcion.service';
import { Funcion } from '~/shared/types/funcion';

type SeleccionHorarioRouteProp = RouteProp<RootStackParamList, 'SeleccionHorario'>;
type SeleccionHorarioNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionHorario'
>;

export default function SeleccionHorario() {
  const navigation = useNavigation<SeleccionHorarioNavigationProp>();
  const route = useRoute<SeleccionHorarioRouteProp>();
  const { peliculaId, cinemaId, cinemaName } = route.params;

  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuncion, setSelectedFuncion] = useState<string | null>(null);
  const [funcionesPorFecha, setFuncionesPorFecha] = useState<{ [key: string]: Funcion[] }>({});

  useEffect(() => {
    loadFunciones();
  }, [peliculaId, cinemaId]);

  const loadFunciones = async () => {
    try {
      setLoading(true);
      const funcionesData = await FuncionService.getFuncionesByPeliculaYCine(peliculaId, cinemaId);

      const funcionesFuturas = funcionesData.filter((funcion) => {
        const fechaFuncion = new Date(funcion.fecha_hora);
        return fechaFuncion > new Date();
      });

      setFunciones(funcionesFuturas);

      // Agrupar por fecha
      const agrupadas = funcionesFuturas.reduce(
        (acc, funcion) => {
          const fecha = new Date(funcion.fecha_hora).toDateString();
          if (!acc[fecha]) {
            acc[fecha] = [];
          }
          acc[fecha].push(funcion);
          return acc;
        },
        {} as { [key: string]: Funcion[] }
      );

      setFuncionesPorFecha(agrupadas);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los horarios disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (selectedFuncion) {
      const funcion = funciones.find((f) => f.id === selectedFuncion);
      if (funcion) {
        navigation.navigate('SeleccionAsientos', {
          funcionId: funcion.id,
          peliculaId,
          cinemaId,
          cinemaName,
        });
      }
    }
  };

  const formatearFecha = (dateString: string) => {
    const fecha = new Date(dateString);
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    if (fecha.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (fecha.toDateString() === manana.toDateString()) {
      return 'Mañana';
    } else {
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const formatearHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const FuncionCard = ({ funcion }: { funcion: Funcion }) => {
    const isSelected = selectedFuncion === funcion.id;

    return (
      <TouchableOpacity
        onPress={() => setSelectedFuncion(funcion.id)}
        className={`mb-3 overflow-hidden rounded-2xl ${isSelected ? 'bg-white' : 'bg-gray-800/50'}`}
        activeOpacity={0.8}>
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="mb-2 flex-row items-center space-x-3">
                <View className="flex-row items-center">
                  <Clock size={16} color={isSelected ? '#374151' : '#9CA3AF'} />
                  <Text
                    className={`ml-2 text-lg font-bold ${
                      isSelected ? 'text-black' : 'text-white'
                    }`}>
                    {formatearHora(funcion.fecha_hora)}
                  </Text>
                </View>

                <View
                  className={`rounded-full px-3 py-1 ${
                    isSelected ? 'bg-blue-100' : 'bg-blue-500/10'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-blue-800' : 'text-blue-400'
                    }`}>
                    {funcion.formato}
                  </Text>
                </View>

                {funcion.subtitulada && (
                  <View
                    className={`rounded-full px-2 py-1 ${
                      isSelected ? 'bg-green-100' : 'bg-green-500/10'
                    }`}>
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-green-800' : 'text-green-400'
                      }`}>
                      SUB
                    </Text>
                  </View>
                )}

                {funcion.doblada && (
                  <View
                    className={`rounded-full px-2 py-1 ${
                      isSelected ? 'bg-purple-100' : 'bg-purple-500/10'
                    }`}>
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? 'text-purple-800' : 'text-purple-400'
                      }`}>
                      DOB
                    </Text>
                  </View>
                )}
              </View>

              <View className="mb-2 flex-row items-center">
                <Users size={14} color={isSelected ? '#6B7280' : '#9CA3AF'} />
                <Text className={`ml-2 text-sm ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                  Sala {funcion.sala?.nombre} • {funcion.sala?.tipo}
                </Text>
              </View>

              <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <DollarSign size={14} color="#10B981" />
                  <Text className="ml-1 text-sm font-bold text-green-400">
                    S/ {funcion.precio_base.toFixed(2)}
                  </Text>
                </View>

                {funcion.precio_vip && funcion.precio_vip > 0 && (
                  <View className="flex-row items-center">
                    <Star size={14} color="#F59E0B" />
                    <Text className="ml-1 text-sm font-bold text-yellow-400">
                      VIP S/ {funcion.precio_vip.toFixed(2)}
                    </Text>
                  </View>
                )}

                {funcion.asientos_disponibles !== undefined && (
                  <Text className={`text-xs ${isSelected ? 'text-gray-600' : 'text-gray-400'}`}>
                    {funcion.asientos_disponibles} disponibles
                  </Text>
                )}
              </View>
            </View>

            {isSelected && (
              <View className="ml-4 h-6 w-6 items-center justify-center rounded-full bg-black">
                <Text className="text-xs font-bold text-white">✓</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">Cargando horarios...</Text>
      </View>
    );
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
              <Text className="text-sm font-medium text-gray-400">Seleccionar horario</Text>
              <Text className="text-2xl font-bold text-white">¿Cuándo quieres verla?</Text>
            </View>
          </View>
        </View>

        {/* Info del cine */}
        <View className="mt-6 rounded-2xl bg-gray-800/30 p-4">
          <View className="flex-row items-center">
            <MapPin size={16} color="#9CA3AF" />
            <Text className="ml-2 text-base font-medium text-white">{cinemaName}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {Object.keys(funcionesPorFecha).length === 0 ? (
          <View className="items-center py-8">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-700/50">
              <Calendar size={32} color="#9CA3AF" />
            </View>
            <Text className="mb-2 text-xl font-bold text-white">No hay funciones disponibles</Text>
            <Text className="text-center text-sm text-gray-400">
              No se encontraron horarios disponibles para esta película en este cine
            </Text>
          </View>
        ) : (
          Object.entries(funcionesPorFecha)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([fecha, funcionesDia]) => (
              <View key={fecha} className="mb-8">
                <View className="mb-4 flex-row items-center">
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-lg font-bold text-white">{formatearFecha(fecha)}</Text>
                  <Text className="ml-2 text-sm text-gray-400">
                    ({funcionesDia.length} función{funcionesDia.length !== 1 ? 'es' : ''})
                  </Text>
                </View>

                {funcionesDia
                  .sort(
                    (a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime()
                  )
                  .map((funcion) => (
                    <FuncionCard key={funcion.id} funcion={funcion} />
                  ))}
              </View>
            ))
        )}

        <View className="h-20" />
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        {selectedFuncion ? (
          <TouchableOpacity
            className="rounded-full bg-white px-6 py-4"
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold text-black">Seleccionar Asientos</Text>
          </TouchableOpacity>
        ) : (
          <View className="rounded-full bg-gray-800/50 px-6 py-4">
            <Text className="text-center text-lg font-medium text-gray-400">
              Selecciona un horario para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
