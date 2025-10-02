import { View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Star, Clock, Info } from 'lucide-react-native';
import { Pelicula } from '~/shared/types/pelicula';
import { formatDuration } from '~/shared/lib/formatUtils';

interface HeroSectionProps {
  pelicula: Pelicula;
  onPlayPress: () => void;
  onInfoPress: () => void;
}

const { width } = Dimensions.get('window');

export default function HeroSection({ pelicula, onPlayPress, onInfoPress }: HeroSectionProps) {
  return (
    <View className="relative mx-4 mb-8 h-96 flex-1 overflow-hidden rounded-3xl">
      <ImageBackground
        source={{
          uri: pelicula.poster_url || 'https://via.placeholder.com/800x600?text=Sin+Imagen',
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

          {/* Sinopsis corta */}
          {pelicula.sinopsis && (
            <Text className="mb-6 text-sm leading-5 text-gray-200 opacity-90" numberOfLines={2}>
              {pelicula.sinopsis}
            </Text>
          )}

          {/* Botones de acción */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onPlayPress}
              className="flex-1 flex-row items-center justify-center rounded-full bg-white px-6 py-3"
              activeOpacity={0.8}>
              <Play size={18} color="#000" fill="#000" />
              <Text className="ml-2 text-base font-bold text-black">Comprar Entradas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onInfoPress}
              className="flex-row items-center justify-center rounded-full bg-gray-800/80 px-4 py-3"
              activeOpacity={0.8}>
              <Info size={18} color="#FFF" />
              <Text className="ml-2 font-semibold text-white">Más Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
