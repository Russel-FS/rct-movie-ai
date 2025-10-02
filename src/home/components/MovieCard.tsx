import { TouchableOpacity, Image, Text, View } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pelicula } from '~/shared/types/pelicula';
import { formatDuration } from '~/shared/lib/formatUtils';

interface MovieCardProps {
  pelicula: Pelicula;
  onPress: () => void;
}

export default function MovieCard({ pelicula, onPress }: MovieCardProps) {
  return (
    <TouchableOpacity
      className="overflow-hidden rounded-3xl border border-gray-800/20 bg-gray-900/30 shadow-2xl backdrop-blur-2xl"
      style={{
        height: 340,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
      onPress={onPress}
      activeOpacity={0.92}>
      {/* Imagen del poster */}
      <View className="relative" style={{ height: 220 }}>
        <Image
          source={{
            uri: pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
          }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Gradiente */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
          className="absolute inset-0"
        />

        {/* Badge destacada */}
        {pelicula.destacada && (
          <View className="absolute right-3 top-3 flex-row items-center rounded-full bg-yellow-400/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm">
            <Star size={9} color="#000" fill="#000" />
            <Text className="ml-1 text-xs font-black tracking-wide text-black">TOP</Text>
          </View>
        )}

        {/* Calificación overlay */}
        <View className="absolute bottom-3 left-3 flex-row items-center rounded-xl bg-black/75 px-3 py-1.5 backdrop-blur-md">
          <Star size={11} color="#FFD700" fill="#FFD700" />
          <Text className="ml-1.5 text-xs font-bold text-white">
            {pelicula.calificacion?.toFixed(1) || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Contenido con altura fija */}
      <View className="flex-1 justify-between p-4" style={{ height: 120 }}>
        {/* Título y subtítulo */}
        <View className="flex-1">
          <Text
            className="text-sm font-bold leading-tight text-white"
            numberOfLines={2}
            style={{ lineHeight: 18 }}>
            {pelicula.titulo}
          </Text>

          {pelicula.titulo_original && pelicula.titulo_original !== pelicula.titulo ? (
            <Text className="mt-1 text-xs text-gray-400" numberOfLines={1}>
              {pelicula.titulo_original}
            </Text>
          ) : (
            <View style={{ height: 16 }} />
          )}
        </View>

        {/* Metadata en la parte inferior */}
        <View className="mt-auto flex-row items-center justify-between">
          <View className="rounded-lg bg-gray-700/70 px-2.5 py-1.5 backdrop-blur-sm">
            <Text className="text-xs font-semibold text-gray-200">{pelicula.clasificacion}</Text>
          </View>

          <View className="flex-row items-center">
            <Clock size={11} color="#9CA3AF" />
            <Text className="ml-1.5 text-xs font-medium text-gray-400">
              {formatDuration(pelicula.duracion)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
