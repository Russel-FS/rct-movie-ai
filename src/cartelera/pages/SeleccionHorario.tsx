import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pelicula } from '~/shared/types/pelicula';
import { PeliculaService } from '~/home/services/pelicula.service';
import { RootStackParamList } from '~/shared/types/navigation';
import { Clock, Star, MapPin, ChevronLeft, Calendar } from 'lucide-react-native';

type SeleccionHorarioRouteProp = RouteProp<RootStackParamList, 'SeleccionHorario'>;
type SeleccionHorarioNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionHorario'
>;

// Datos de ejemplo de fechas y funciones
const fechasDisponibles = [
  { id: 1, fecha: '2025-10-01', diaSemana: 'Martes', dia: '01', mes: 'Oct' },
  { id: 2, fecha: '2025-10-02', diaSemana: 'Miércoles', dia: '02', mes: 'Oct' },
  { id: 3, fecha: '2025-10-03', diaSemana: 'Jueves', dia: '03', mes: 'Oct' },
  { id: 4, fecha: '2025-10-04', diaSemana: 'Viernes', dia: '04', mes: 'Oct' },
  { id: 5, fecha: '2025-10-05', diaSemana: 'Sábado', dia: '05', mes: 'Oct' },
];

const funcionesDisponibles = [
  { id: 1, hora: '14:30', sala: 'Sala 1', formato: '2D', precio: 12.5, asientosDisponibles: 45 },
  { id: 2, hora: '17:00', sala: 'Sala 2', formato: '2D', precio: 12.5, asientosDisponibles: 32 },
  { id: 3, hora: '19:30', sala: 'Sala 1', formato: '3D', precio: 15.0, asientosDisponibles: 28 },
  { id: 4, hora: '22:00', sala: 'Sala 3', formato: '2D', precio: 12.5, asientosDisponibles: 18 },
];

export default function SeleccionHorario() {
  const navigation = useNavigation<SeleccionHorarioNavigationProp>();
  const route = useRoute<SeleccionHorarioRouteProp>();
  const { peliculaId, cinemaId, cinemaName } = route.params;
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFecha, setSelectedFecha] = useState<number>(1);
  const [selectedFuncion, setSelectedFuncion] = useState<number | null>(null);

  const formatDuration = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  useEffect(() => {
    const fetchPelicula = async () => {
      try {
        setLoading(true);
        const data = await PeliculaService.getPeliculaById(peliculaId);
        setPelicula(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar película:', err);
        setError('Error al cargar la información de la película');
      } finally {
        setLoading(false);
      }
    };

    fetchPelicula();
  }, [peliculaId]);

  const handleContinue = () => {
    if (selectedFuncion !== null) {
      const funcion = funcionesDisponibles.find((f) => f.id === selectedFuncion);
      const fecha = fechasDisponibles.find((f) => f.id === selectedFecha);
      if (funcion && fecha) {
        navigation.navigate('SeleccionButacas', {
          peliculaId,
          cinemaId,
          cinemaName,
          funcionId: funcion.id,
          fecha: fecha.fecha,
          hora: funcion.hora,
          sala: funcion.sala,
          formato: funcion.formato,
          precio: funcion.precio,
        });
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">Cargando información...</Text>
      </View>
    );
  }

  if (error || !pelicula) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-6 text-center text-base text-red-400">
          {error || 'No se pudo cargar la película'}
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          className="rounded-xl bg-blue-600 px-8 py-3"
          activeOpacity={0.8}>
          <Text className="text-base font-bold text-white">Volver</Text>
        </TouchableOpacity>
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
              <Text className="text-2xl font-bold text-white">¿Cuándo la vemos?</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Info de película y cine */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <Text className="mb-2 text-xl font-bold text-white">{pelicula.titulo}</Text>

            <View className="mb-3 flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text className="ml-1 font-semibold text-white">
                  {pelicula.calificacion?.toFixed(1) || 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-gray-300">{formatDuration(pelicula.duracion)}</Text>
              </View>

              <View className="rounded bg-gray-700/80 px-2 py-1">
                <Text className="text-xs font-semibold text-white">{pelicula.clasificacion}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <MapPin size={16} color="#9CA3AF" />
              <Text className="ml-2 text-gray-300">{cinemaName}</Text>
            </View>
          </View>
        </View>

        {/* Selector de fecha */}
        <View className="mb-8 px-4">
          <Text className="mb-4 text-2xl font-bold text-white">Fechas Disponibles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {fechasDisponibles.map((fecha) => (
              <TouchableOpacity
                key={fecha.id}
                onPress={() => setSelectedFecha(fecha.id)}
                className={`mr-4 min-w-[90px] items-center rounded-3xl p-4 ${
                  selectedFecha === fecha.id ? 'bg-white' : 'bg-gray-800/50'
                }`}
                activeOpacity={0.8}>
                <Text
                  className={`mb-1 text-xs font-medium ${
                    selectedFecha === fecha.id ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                  {fecha.diaSemana}
                </Text>
                <Text
                  className={`text-2xl font-bold ${
                    selectedFecha === fecha.id ? 'text-black' : 'text-white'
                  }`}>
                  {fecha.dia}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    selectedFecha === fecha.id ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                  {fecha.mes}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Funciones disponibles */}
        <View className="px-4">
          <Text className="mb-6 text-2xl font-bold text-white">Horarios Disponibles</Text>

          {funcionesDisponibles.map((funcion) => (
            <TouchableOpacity
              key={funcion.id}
              onPress={() => setSelectedFuncion(funcion.id)}
              className={`mb-4 overflow-hidden rounded-3xl ${
                selectedFuncion === funcion.id ? 'bg-white' : 'bg-gray-800/50'
              }`}
              activeOpacity={0.8}>
              <View className="p-6">
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Clock size={20} color={selectedFuncion === funcion.id ? '#000' : '#3B82F6'} />
                    <Text
                      className={`ml-3 text-2xl font-bold ${
                        selectedFuncion === funcion.id ? 'text-black' : 'text-white'
                      }`}>
                      {funcion.hora}
                    </Text>
                  </View>

                  <View
                    className={`rounded-full px-4 py-2 ${
                      selectedFuncion === funcion.id ? 'bg-black' : 'bg-gray-700/80'
                    }`}>
                    <Text className="font-bold text-white">
                      ${funcion.precio?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text
                      className={`mb-1 text-base font-medium ${
                        selectedFuncion === funcion.id ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                      {funcion.sala} • {funcion.formato}
                    </Text>
                    <Text
                      className={`text-sm font-medium ${
                        funcion.asientosDisponibles > 20
                          ? selectedFuncion === funcion.id
                            ? 'text-green-600'
                            : 'text-green-400'
                          : funcion.asientosDisponibles > 10
                            ? selectedFuncion === funcion.id
                              ? 'text-yellow-600'
                              : 'text-yellow-400'
                            : selectedFuncion === funcion.id
                              ? 'text-red-600'
                              : 'text-red-400'
                      }`}>
                      {funcion.asientosDisponibles} asientos disponibles
                    </Text>
                  </View>

                  {selectedFuncion === funcion.id && (
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-black">
                      <Text className="font-bold text-white">✓</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Espaciado inferior */}
        <View className="h-32" />
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        {selectedFuncion !== null ? (
          <TouchableOpacity
            className="rounded-full bg-white px-6 py-4"
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold text-black">
              Continuar con {funcionesDisponibles.find((f) => f.id === selectedFuncion)?.hora}
            </Text>
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
