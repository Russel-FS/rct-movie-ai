import { TouchableOpacity, Image, Text, View } from 'react-native';
import { Star, Clock, Film } from 'lucide-react-native';
import { Pelicula } from '~/shared/types/pelicula';
import { formatDuration } from '~/shared/lib/formatUtils';

interface FeaturedMovieCardProps {
  pelicula: Pelicula;
  onPress: () => void;
}

export default function FeaturedMovieCard({ pelicula, onPress }: FeaturedMovieCardProps) {
  return (
    <TouchableOpacity
      className="mr-3 w-48 rounded-lg bg-gray-800 p-3"
      onPress={onPress}
      activeOpacity={0.7}>
      <Image
        source={{
          uri: pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        }}
        className="mb-3 h-64 w-full rounded-lg"
        resizeMode="cover"
      />

      <View className="absolute right-1 top-1 flex-row items-center rounded bg-yellow-500 px-2 py-1">
        <Star size={12} color="#000000" fill="#000000" />
        <Text className="ml-1 text-xs font-bold text-black">Destacada</Text>
      </View>

      <Text className="mb-1 text-base font-bold text-white" numberOfLines={2}>
        {pelicula.titulo}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Film size={12} color="#9CA3AF" />
          <Text className="ml-1 text-xs text-gray-400">{pelicula.clasificacion}</Text>
        </View>
        <View className="flex-row items-center">
          <Star size={12} color="#EAB308" fill="#EAB308" />
          <Text className="ml-1 text-xs text-white">
            {pelicula.calificacion?.toFixed(1) || 'N/A'}
          </Text>
        </View>
      </View>

      <View className="mt-1 flex-row items-center">
        <Clock size={12} color="#9CA3AF" />
        <Text className="ml-1 text-xs text-gray-400">{formatDuration(pelicula.duracion)}</Text>
      </View>
    </TouchableOpacity>
  );
}
