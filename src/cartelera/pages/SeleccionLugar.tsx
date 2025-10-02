import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '~/home/services/pelicula.service';
import { GeneroService } from '~/home/services/genero.service';
import { RootStackParamList } from '~/shared/types/navigation';
import { Calendar, Clock, Star, Film, Users, Play } from 'lucide-react-native';

const cinemas = [
  {
    id: 1,
    name: 'Cinépolis Plaza Norte',
    address: 'Av. Constituyentes 1050, Col. Centro',
    distance: '2.3 km',
  },
  {
    id: 2,
    name: 'Cinemex Galerías',
    address: 'Blvd. Miguel de Cervantes 1200',
    distance: '4.8 km',
  },
  {
    id: 3,
    name: 'Cinépolis VIP Centro',
    address: 'Calle Madero 445, Centro Histórico',
    distance: '5.8 km',
  },
];

type SeleccionLugarRouteProp = RouteProp<RootStackParamList, 'SeleccionLugar'>;
type SeleccionLugarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SeleccionLugar'>;

export default function SeleccionLugar() {
  const navigation = useNavigation<SeleccionLugarNavigationProp>();
  const route = useRoute<SeleccionLugarRouteProp>();
  const { peliculaId } = route.params;
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getGeneros = (): string => {
    if (generos && generos.length > 0) {
      return generos.map((g) => g.nombre).join(', ');
    }
    return 'Sin género';
  };

  const handleWatchTrailer = async () => {
    if (!pelicula?.trailer_url) {
      Alert.alert(
        'Tráiler no disponible',
        'Este contenido no tiene tráiler disponible en este momento.'
      );
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(pelicula.trailer_url);
      if (canOpen) {
        await Linking.openURL(pelicula.trailer_url);
      } else {
        Alert.alert('Error', 'No se puede abrir el tráiler');
      }
    } catch (error) {
      console.error('Error al abrir tráiler:', error);
      Alert.alert('Error', 'Hubo un problema al abrir el tráiler');
    }
  };

  const handleContinue = () => {
    if (selectedCinema !== null) {
      const cinema = cinemas.find((c) => c.id === selectedCinema);
      if (cinema) {
        navigation.navigate('SeleccionHorario', {
          peliculaId,
          cinemaId: cinema.id,
          cinemaName: cinema.name,
        });
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchPelicula = async () => {
      if (!peliculaId) {
        setError('No se proporcionó un ID de película');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await PeliculaService.getPeliculaById(peliculaId);
        setPelicula(data);

        // Cargar géneros de la película usando el servicio
        try {
          const generosIds = await PeliculaService.getGenerosPelicula(peliculaId);
          const todosGeneros = await GeneroService.getGeneros();
          const generosFiltrados = todosGeneros.filter((g) => generosIds.includes(g.id));
          setGeneros(generosFiltrados);
        } catch (generoError) {
          console.error('Error al cargar géneros:', generoError);
          setGeneros([]);
        }

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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">Cargando película...</Text>
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
          <Text className="text-base font-bold text-white">Volver al inicio</Text>
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
            <Text className="text-xl font-bold text-white">Seleccionar Cine</Text>
            <Text className="mt-1 text-sm text-gray-400">Elige dónde ver {pelicula.titulo}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Movie Card con Poster */}
        <View className="mx-6 mb-6 mt-6">
          <View className="overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
            {/* Poster con overlay para el trailer */}
            <View className="relative">
              {pelicula.poster_url ? (
                <Image
                  source={{ uri: pelicula.poster_url }}
                  className="h-64 w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-64 w-full items-center justify-center bg-gray-800">
                  <Film size={48} color="#6B7280" />
                  <Text className="mt-2 text-gray-500">Sin imagen</Text>
                </View>
              )}

              {/* Botón de tráiler superpuesto */}
              {pelicula.trailer_url && (
                <View className="absolute inset-0 items-center justify-center">
                  <TouchableOpacity
                    onPress={handleWatchTrailer}
                    className="h-16 w-16 items-center justify-center rounded-full bg-blue-600/90"
                    activeOpacity={0.8}>
                    <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Info Card */}
            <View className="p-6">
              {/* Título y Rating */}
              <View className="mb-4">
                <Text className="mb-2 text-2xl font-bold text-white">{pelicula.titulo}</Text>
                {pelicula.titulo_original && pelicula.titulo_original !== pelicula.titulo && (
                  <Text className="mb-3 text-sm text-gray-400">{pelicula.titulo_original}</Text>
                )}
                <View className="flex-row items-center">
                  <View className="mr-3 flex-row items-center rounded-lg bg-yellow-500/20 px-3 py-2">
                    <Star size={16} color="#EAB308" fill="#EAB308" />
                    <Text className="ml-2 text-base font-bold text-yellow-400">
                      {pelicula.calificacion?.toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                  <View className="rounded-lg bg-gray-800 px-3 py-2">
                    <Text className="font-semibold text-gray-300">{pelicula.clasificacion}</Text>
                  </View>
                </View>
              </View>

              {/* Botón Ver Tráiler (alternativo, debajo del título) */}
              {pelicula.trailer_url && (
                <TouchableOpacity
                  onPress={handleWatchTrailer}
                  className="mb-5 flex-row items-center justify-center rounded-xl bg-red-600 px-4 py-3"
                  activeOpacity={0.8}>
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                  <Text className="ml-2 text-base font-bold text-white">Ver Tráiler</Text>
                </TouchableOpacity>
              )}

              {/* Info Row */}
              <View className="mb-5 space-y-3">
                <View className="flex-row items-center">
                  <Clock size={18} color="#9CA3AF" />
                  <Text className="ml-3 text-base text-gray-300">
                    {formatDuration(pelicula.duracion)}
                  </Text>
                </View>

                <View className="flex-row items-start">
                  <Film size={18} color="#9CA3AF" />
                  <Text className="ml-3 flex-1 text-base text-gray-300">{getGeneros()}</Text>
                </View>

                {pelicula.fecha_estreno && (
                  <View className="flex-row items-center">
                    <Calendar size={18} color="#9CA3AF" />
                    <Text className="ml-3 text-base text-gray-300">
                      Estreno: {formatDate(pelicula.fecha_estreno)}
                    </Text>
                  </View>
                )}

                {pelicula.director && (
                  <View className="flex-row items-start">
                    <Users size={18} color="#9CA3AF" />
                    <Text className="ml-3 flex-1 text-base text-gray-300">
                      Director: {pelicula.director}
                    </Text>
                  </View>
                )}

                {pelicula.idioma_original && (
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-400">Idioma: </Text>
                    <Text className="text-sm text-gray-300">{pelicula.idioma_original}</Text>
                  </View>
                )}

                {pelicula.subtitulos && (
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-400">Subtítulos: </Text>
                    <Text className="text-sm text-gray-300">{pelicula.subtitulos}</Text>
                  </View>
                )}
              </View>

              {/* Sinopsis */}
              {pelicula.sinopsis && (
                <View className="mb-4 rounded-xl bg-gray-800/50 p-4">
                  <Text className="mb-2 text-base font-semibold text-white">Sinopsis</Text>
                  <Text className="text-sm leading-6 text-gray-300">
                    {showFullSynopsis
                      ? pelicula.sinopsis
                      : pelicula.sinopsis.length > 200
                        ? `${pelicula.sinopsis.substring(0, 200)}...`
                        : pelicula.sinopsis}
                  </Text>
                  {pelicula.sinopsis.length > 200 && (
                    <TouchableOpacity
                      onPress={() => setShowFullSynopsis(!showFullSynopsis)}
                      className="mt-3"
                      activeOpacity={0.7}>
                      <Text className="text-sm font-semibold text-blue-400">
                        {showFullSynopsis ? 'Ver menos' : 'Ver más'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Reparto */}
              {pelicula.reparto && (
                <View className="rounded-xl bg-gray-800/50 p-4">
                  <Text className="mb-2 text-base font-semibold text-white">Reparto</Text>
                  <Text className="text-sm leading-6 text-gray-300">{pelicula.reparto}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Lista de cines */}
        <View className="px-6 pb-8">
          <Text className="mb-4 text-xl font-bold text-white">Seleccionar Cine</Text>
          {cinemas.map((cine) => (
            <View
              key={cine.id}
              className={`mb-4 rounded-2xl p-5 ${
                selectedCinema === cine.id ? 'border-2 border-blue-500 bg-gray-800' : 'bg-gray-900'
              }`}>
              <TouchableOpacity onPress={() => setSelectedCinema(cine.id)} activeOpacity={0.7}>
                <Text className="mb-2 text-lg font-bold text-white">{cine.name}</Text>
                <Text className="mb-1 text-sm text-gray-400">{cine.address}</Text>
                <Text className="text-xs text-gray-500">📍 {cine.distance} de tu ubicación</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer dinámico */}
      <View className="border-t border-gray-800 bg-gray-900 px-6 py-5">
        {selectedCinema !== null ? (
          <View>
            <View className="mb-3">
              <Text className="mb-1 text-xs text-gray-400">Cine seleccionado:</Text>
              <Text className="text-base font-bold text-white">
                {cinemas.find((c) => c.id === selectedCinema)?.name}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-xl bg-blue-600 px-6 py-4"
              onPress={handleContinue}
              activeOpacity={0.8}>
              <Text className="text-center text-base font-bold text-white">
                Continuar a Selección de Horario
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="rounded-xl bg-gray-800 px-4 py-4">
            <Text className="text-center text-sm text-gray-400">
              Selecciona un cine para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
