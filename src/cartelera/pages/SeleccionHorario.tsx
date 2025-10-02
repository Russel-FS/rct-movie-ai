import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pelicula } from '~/shared/types/pelicula';
import { PeliculaService } from '~/home/services/pelicula.service';
import { RootStackParamList } from '~/shared/types/navigation';
import { Clock, Star, MapPin, ChevronRight } from 'lucide-react-native';

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
      <View className="border-b border-gray-800 bg-gray-900 px-6 pb-6 pt-12">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800"
            activeOpacity={0.7}>
            <Text className="text-2xl text-white">{'‹'}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Seleccionar Horario</Text>
            <Text className="mt-1 text-sm text-gray-400">{pelicula.titulo}</Text>
          </View>
        </View>

        {/* Progreso de pasos */}
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-green-600">
              <Text className="text-xs font-bold text-white">✓</Text>
            </View>
            <Text className="ml-2 text-xs text-green-400">Lugar</Text>
          </View>
          <View className="mx-2 h-0.5 flex-1 bg-blue-600" />
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <Text className="text-xs font-bold text-white">2</Text>
            </View>
            <Text className="ml-2 text-xs text-white">Horario</Text>
          </View>
          <View className="mx-2 h-0.5 flex-1 bg-gray-700" />
          <View className="flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-700">
              <Text className="text-xs font-bold text-gray-400">3</Text>
            </View>
            <Text className="ml-2 text-xs text-gray-400">Asientos</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Info de película y cine seleccionado */}
        <View className="mx-6 mt-6">
          <View className="mb-6 rounded-2xl bg-gray-900 p-5">
            <View className="mb-3 flex-row items-center">
              <Star size={18} color="#EAB308" fill="#EAB308" />
              <Text className="ml-2 text-lg font-bold text-white">{pelicula.titulo}</Text>
            </View>

            <View className="mb-2 flex-row items-center">
              <Clock size={16} color="#9CA3AF" />
              <Text className="ml-2 text-sm text-gray-300">
                {formatDuration(pelicula.duracion)} • {pelicula.clasificacion}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MapPin size={16} color="#3B82F6" />
              <Text className="ml-2 text-sm text-blue-400">{cinemaName}</Text>
            </View>
          </View>

          {/* Selector de fecha */}
          <Text className="mb-4 text-lg font-bold text-white">Selecciona la fecha</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {fechasDisponibles.map((fecha) => (
              <TouchableOpacity
                key={fecha.id}
                onPress={() => setSelectedFecha(fecha.id)}
                className={`mr-3 min-w-[80px] items-center rounded-xl p-4 ${
                  selectedFecha === fecha.id
                    ? 'border-2 border-blue-400 bg-blue-600'
                    : 'bg-gray-800'
                }`}
                activeOpacity={0.7}>
                <Text
                  className={`mb-1 text-xs font-semibold ${
                    selectedFecha === fecha.id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                  {fecha.diaSemana}
                </Text>
                <Text
                  className={`text-2xl font-bold ${
                    selectedFecha === fecha.id ? 'text-white' : 'text-gray-300'
                  }`}>
                  {fecha.dia}
                </Text>
                <Text
                  className={`text-xs ${
                    selectedFecha === fecha.id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                  {fecha.mes}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Funciones disponibles */}
          <Text className="mb-4 text-lg font-bold text-white">Funciones disponibles</Text>

          {funcionesDisponibles.map((funcion) => (
            <TouchableOpacity
              key={funcion.id}
              onPress={() => setSelectedFuncion(funcion.id)}
              className={`mb-4 rounded-2xl p-5 ${
                selectedFuncion === funcion.id
                  ? 'border-2 border-blue-500 bg-gray-800'
                  : 'bg-gray-900'
              }`}
              activeOpacity={0.7}>
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Clock size={20} color="#3B82F6" />
                  <Text className="ml-3 text-xl font-bold text-white">{funcion.hora}</Text>
                </View>
                <View className="rounded-lg bg-blue-600 px-3 py-1">
                  <Text className="font-bold text-white">
                    ${funcion.precio?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-sm text-gray-300">
                    {funcion.sala} • {funcion.formato}
                  </Text>
                  <Text
                    className={`text-xs ${
                      funcion.asientosDisponibles > 20
                        ? 'text-green-400'
                        : funcion.asientosDisponibles > 10
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}>
                    {funcion.asientosDisponibles} asientos disponibles
                  </Text>
                </View>
                {selectedFuncion === funcion.id && (
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <Text className="font-bold text-white">✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Espaciado inferior */}
        <View className="h-32" />
      </ScrollView>

      {/* Footer con resumen */}
      <View className="border-t border-gray-800 bg-gray-900 px-6 py-5">
        {selectedFuncion !== null ? (
          <View>
            <View className="mb-3">
              <Text className="mb-2 text-xs text-gray-400">Resumen de selección:</Text>
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm text-gray-300">Película:</Text>
                <Text className="text-sm font-semibold text-white">{pelicula.titulo}</Text>
              </View>
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm text-gray-300">Cine:</Text>
                <Text className="text-sm font-semibold text-white">{cinemaName}</Text>
              </View>
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-sm text-gray-300">Fecha:</Text>
                <Text className="text-sm font-semibold text-white">
                  {fechasDisponibles.find((f) => f.id === selectedFecha)?.diaSemana}{' '}
                  {fechasDisponibles.find((f) => f.id === selectedFecha)?.dia}{' '}
                  {fechasDisponibles.find((f) => f.id === selectedFecha)?.mes}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-300">Función:</Text>
                <Text className="text-sm font-semibold text-white">
                  {funcionesDisponibles.find((f) => f.id === selectedFuncion)?.hora} -{' '}
                  {funcionesDisponibles.find((f) => f.id === selectedFuncion)?.sala}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-xl bg-blue-600 px-6 py-4"
              onPress={handleContinue}
              activeOpacity={0.8}>
              <Text className="mr-2 text-center text-base font-bold text-white">
                Continuar a Selección de Asientos
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="rounded-xl bg-gray-800 px-4 py-4">
            <Text className="text-center text-sm text-gray-400">
              Selecciona una función para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
