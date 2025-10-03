import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '~/home/services/pelicula.service';
import { GeneroService } from '~/home/services/genero.service';
import { RootStackParamList } from '~/shared/types/navigation';
import { Calendar, Clock, Star, Film, Users, Play, MapPin, ChevronLeft } from 'lucide-react-native';
import { useCines } from '~/shared/hooks/useCines';
import { usePelicula } from '~/shared/hooks/usePeliculas';
import { MOVIE_CONFIG, ERROR_MESSAGES } from '~/shared/constants/app.constants';
import {
  formatearDuracion,
  formatearFecha,
  formatearCalificacion,
} from '~/shared/utils/format.utils';

type SeleccionLugarRouteProp = RouteProp<RootStackParamList, 'SeleccionLugar'>;
type SeleccionLugarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SeleccionLugar'>;

export default function SeleccionLugar() {
  const navigation = useNavigation<SeleccionLugarNavigationProp>();
  const route = useRoute<SeleccionLugarRouteProp>();
  const { peliculaId } = route.params;
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const { cines, loading: loadingCines } = useCines({ incluirUbicacion: true, radio: 20 });
  const { pelicula, generos, loading, error } = usePelicula(peliculaId);

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
      const cinema = cines.find((c) => c.id === selectedCinema);
      if (cinema) {
        navigation.navigate('SeleccionHorario', {
          peliculaId,
          cinemaId: cinema.id,
          cinemaName: cinema.nombre,
        });
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading || loadingCines) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">
          {loading ? 'Cargando película...' : 'Cargando cines...'}
        </Text>
      </View>
    );
  }

  if (error || !pelicula) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-6 text-center text-base text-red-400">
          {error || ERROR_MESSAGES.MOVIE_NOT_FOUND}
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
      {/* Header  */}
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
              <Text className="text-sm font-medium text-gray-400">Seleccionar cine</Text>
              <Text className="text-2xl font-bold text-white">¿Dónde quieres verla?</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section  */}
        <View className="relative mx-4 mb-8 h-80 overflow-hidden rounded-3xl">
          <ImageBackground
            source={{
              uri: pelicula.poster_url || MOVIE_CONFIG.DEFAULT_POSTER_URL,
            }}
            className="flex-1 justify-end"
            resizeMode="cover">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              className="absolute inset-0"
            />

            {/* Contenido */}
            <View className="relative p-6 pb-8">
              {/* Badge destacada */}
              {pelicula.destacada && (
                <View className="absolute -top-2 right-6 flex-row items-center rounded-full bg-yellow-500 px-3 py-1">
                  <Star size={12} color="#000" fill="#000" />
                  <Text className="ml-1 text-xs font-bold text-black">DESTACADA</Text>
                </View>
              )}

              {/* Título */}
              <Text className="mb-2 text-3xl font-bold leading-tight text-white">
                {pelicula.titulo}
              </Text>

              {/* Subtítulo */}
              {pelicula.titulo_original && pelicula.titulo_original !== pelicula.titulo && (
                <Text className="mb-3 text-lg text-gray-300 opacity-90">
                  {pelicula.titulo_original}
                </Text>
              )}

              {/* Metadata */}
              <View className="mb-4 flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text className="ml-1 font-semibold text-white">
                    {formatearCalificacion(pelicula.calificacion)}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Clock size={14} color="#9CA3AF" />
                  <Text className="ml-1 text-gray-300">{formatearDuracion(pelicula.duracion)}</Text>
                </View>

                <View className="rounded bg-gray-700/80 px-2 py-1">
                  <Text className="text-xs font-semibold text-white">{pelicula.clasificacion}</Text>
                </View>
              </View>

              {/* Géneros */}
              <Text className="mb-4 text-sm text-gray-200 opacity-90">{getGeneros()}</Text>

              {/* Botones de acción */}
              <View className="flex-row space-x-3">
                {pelicula.trailer_url && (
                  <TouchableOpacity
                    onPress={handleWatchTrailer}
                    className="flex-row items-center justify-center rounded-full bg-gray-800/80 px-4 py-3"
                    activeOpacity={0.8}>
                    <Play size={18} color="#FFF" />
                    <Text className="ml-2 font-semibold text-white">Ver Tráiler</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Lista de cines */}
        <View className="px-4 pb-8">
          <Text className="mb-6 text-2xl font-bold text-white">Cines Disponibles</Text>

          {cines.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-base text-gray-400">{ERROR_MESSAGES.CINEMAS_NOT_FOUND}</Text>
            </View>
          ) : (
            cines.map((cine) => (
              <TouchableOpacity
                key={cine.id}
                onPress={() => setSelectedCinema(cine.id)}
                className={`mb-4 overflow-hidden rounded-3xl ${
                  selectedCinema === cine.id ? 'bg-white' : 'bg-gray-800/50'
                }`}
                activeOpacity={0.8}>
                <View className="p-6">
                  {/* Header del cine */}
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text
                        className={`mb-2 text-xl font-bold ${
                          selectedCinema === cine.id ? 'text-black' : 'text-white'
                        }`}>
                        {cine.nombre}
                      </Text>
                      <Text
                        className={`text-base leading-6 ${
                          selectedCinema === cine.id ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                        {cine.direccion}
                      </Text>
                    </View>

                    {selectedCinema === cine.id && (
                      <View className="ml-4 h-8 w-8 items-center justify-center rounded-full bg-black">
                        <Text className="text-sm font-bold text-white">✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Footer con distancia */}
                  <View className="flex-row items-center">
                    <MapPin size={16} color={selectedCinema === cine.id ? '#6B7280' : '#9CA3AF'} />
                    <Text
                      className={`ml-2 text-sm font-medium ${
                        selectedCinema === cine.id ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                      {cine.distance || 'Distancia no disponible'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer*/}
      <View className="border-t border-gray-800/50 bg-black px-4 py-6">
        {selectedCinema !== null ? (
          <TouchableOpacity
            className="rounded-full bg-white px-6 py-4"
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-bold text-black">
              Continuar con {cines.find((c) => c.id === selectedCinema)?.nombre}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="rounded-full bg-gray-800/50 px-6 py-4">
            <Text className="text-center text-lg font-medium text-gray-400">
              Selecciona un cine para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
