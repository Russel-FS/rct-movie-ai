import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Pelicula } from '~/shared/types/pelicula';
import { PeliculaService } from '~/home/services/pelicula.service';
import { Calendar, Clock, Star, MapPin, ChevronRight } from 'lucide-react-native';

interface SeleccionHorarioProps {
  peliculaId: string;
  cinemaId: number;
  cinemaName: string;
  horario: string;
  onBack?: () => void;
  onContinue?: (funcionId: number, fecha: string, sala: string, formato: string, precio: number) => void;
}

// Datos de ejemplo de fechas y funciones
const fechasDisponibles = [
  { id: 1, fecha: '2025-10-01', diaSemana: 'Martes', dia: '01', mes: 'Oct' },
  { id: 2, fecha: '2025-10-02', diaSemana: 'Miércoles', dia: '02', mes: 'Oct' },
  { id: 3, fecha: '2025-10-03', diaSemana: 'Jueves', dia: '03', mes: 'Oct' },
  { id: 4, fecha: '2025-10-04', diaSemana: 'Viernes', dia: '04', mes: 'Oct' },
  { id: 5, fecha: '2025-10-05', diaSemana: 'Sábado', dia: '05', mes: 'Oct' },
];

const funcionesDisponibles = [
  { id: 1, hora: '14:30', sala: 'Sala 1', formato: '2D', precio: 12.50, asientosDisponibles: 45 },
  { id: 2, hora: '17:00', sala: 'Sala 2', formato: '2D', precio: 12.50, asientosDisponibles: 32 },
  { id: 3, hora: '19:30', sala: 'Sala 1', formato: '3D', precio: 15.00, asientosDisponibles: 28 },
  { id: 4, hora: '22:00', sala: 'Sala 3', formato: '2D', precio: 12.50, asientosDisponibles: 18 },
];

export default function SeleccionHorario({ 
  peliculaId, 
  cinemaId, 
  cinemaName, 
  horario,
  onBack,
  onContinue 
}: SeleccionHorarioProps) {
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
    if (selectedFuncion !== null && onContinue) {
      const funcion = funcionesDisponibles.find(f => f.id === selectedFuncion);
      const fecha = fechasDisponibles.find(f => f.id === selectedFecha);
      if (funcion && fecha) {
        onContinue(
          funcion.id,
          fecha.fecha,
          funcion.sala,
          funcion.formato,
          funcion.precio
        );
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-white text-base">Cargando información...</Text>
      </View>
    );
  }

  if (error || !pelicula) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-6 text-center text-red-400 text-base">
          {error || 'No se pudo cargar la película'}
        </Text>
        <TouchableOpacity
          onPress={() => onBack && onBack()}
          className="rounded-xl bg-blue-600 px-8 py-3"
          activeOpacity={0.8}
        >
          <Text className="font-bold text-white text-base">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-gray-900 pb-6 pt-12 px-6 border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => onBack && onBack()}
            className="bg-gray-800 rounded-full w-10 h-10 items-center justify-center mr-4"
            activeOpacity={0.7}
          >
            <Text className="text-white text-2xl">{'‹'}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Seleccionar Horario</Text>
            <Text className="text-gray-400 text-sm mt-1">{pelicula.titulo}</Text>
          </View>
        </View>

        {/* Progreso de pasos */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <View className="bg-green-600 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white text-xs font-bold">✓</Text>
            </View>
            <Text className="text-green-400 text-xs ml-2">Lugar</Text>
          </View>
          <View className="flex-1 h-0.5 bg-blue-600 mx-2" />
          <View className="flex-row items-center">
            <View className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white text-xs font-bold">2</Text>
            </View>
            <Text className="text-white text-xs ml-2">Horario</Text>
          </View>
          <View className="flex-1 h-0.5 bg-gray-700 mx-2" />
          <View className="flex-row items-center">
            <View className="bg-gray-700 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-gray-400 text-xs font-bold">3</Text>
            </View>
            <Text className="text-gray-400 text-xs ml-2">Asientos</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Info de película y cine seleccionado */}
        <View className="mx-6 mt-6">
          <View className="bg-gray-900 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center mb-3">
              <Star size={18} color="#EAB308" fill="#EAB308" />
              <Text className="text-white font-bold text-lg ml-2">{pelicula.titulo}</Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Clock size={16} color="#9CA3AF" />
              <Text className="text-gray-300 text-sm ml-2">
                {formatDuration(pelicula.duracion)} • {pelicula.clasificacion}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MapPin size={16} color="#3B82F6" />
              <Text className="text-blue-400 text-sm ml-2">{cinemaName}</Text>
            </View>
          </View>

          {/* Selector de fecha */}
          <Text className="text-white text-lg font-bold mb-4">Selecciona la fecha</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {fechasDisponibles.map((fecha) => (
              <TouchableOpacity
                key={fecha.id}
                onPress={() => setSelectedFecha(fecha.id)}
                className={`mr-3 rounded-xl p-4 min-w-[80px] items-center ${
                  selectedFecha === fecha.id 
                    ? 'bg-blue-600 border-2 border-blue-400' 
                    : 'bg-gray-800'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-xs font-semibold mb-1 ${
                  selectedFecha === fecha.id ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {fecha.diaSemana}
                </Text>
                <Text className={`text-2xl font-bold ${
                  selectedFecha === fecha.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {fecha.dia}
                </Text>
                <Text className={`text-xs ${
                  selectedFecha === fecha.id ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {fecha.mes}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Funciones disponibles */}
          <Text className="text-white text-lg font-bold mb-4">Funciones disponibles</Text>
          
          {funcionesDisponibles.map((funcion) => (
            <TouchableOpacity
              key={funcion.id}
              onPress={() => setSelectedFuncion(funcion.id)}
              className={`mb-4 rounded-2xl p-5 ${
                selectedFuncion === funcion.id 
                  ? 'bg-gray-800 border-2 border-blue-500' 
                  : 'bg-gray-900'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Clock size={20} color="#3B82F6" />
                  <Text className="text-white text-xl font-bold ml-3">{funcion.hora}</Text>
                </View>
                <View className="bg-blue-600 rounded-lg px-3 py-1">
                  <Text className="text-white font-bold">${funcion.precio.toFixed(2)}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-300 text-sm mb-1">
                    {funcion.sala} • {funcion.formato}
                  </Text>
                  <Text className={`text-xs ${
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
                  <View className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center">
                    <Text className="text-white font-bold">✓</Text>
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
      <View className="px-6 py-5 bg-gray-900 border-t border-gray-800">
        {selectedFuncion !== null ? (
          <View>
            <View className="mb-3">
              <Text className="text-gray-400 text-xs mb-2">Resumen de selección:</Text>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-300 text-sm">Película:</Text>
                <Text className="text-white text-sm font-semibold">{pelicula.titulo}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-300 text-sm">Cine:</Text>
                <Text className="text-white text-sm font-semibold">{cinemaName}</Text>
              </View>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-300 text-sm">Fecha:</Text>
                <Text className="text-white text-sm font-semibold">
                  {fechasDisponibles.find(f => f.id === selectedFecha)?.diaSemana} {fechasDisponibles.find(f => f.id === selectedFecha)?.dia} {fechasDisponibles.find(f => f.id === selectedFecha)?.mes}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-300 text-sm">Función:</Text>
                <Text className="text-white text-sm font-semibold">
                  {funcionesDisponibles.find(f => f.id === selectedFuncion)?.hora} - {funcionesDisponibles.find(f => f.id === selectedFuncion)?.sala}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="bg-blue-600 px-6 py-4 rounded-xl flex-row items-center justify-center"
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-base mr-2">
                Continuar a Selección de Asientos
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-gray-800 px-4 py-4 rounded-xl">
            <Text className="text-gray-400 text-center text-sm">
              Selecciona una función para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}