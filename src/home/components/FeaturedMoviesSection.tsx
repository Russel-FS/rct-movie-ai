import { View, Text, ScrollView } from 'react-native';
import { Star, Film } from 'lucide-react-native';
import { Pelicula } from '~/shared/types/pelicula';
import FeaturedMovieCard from './FeaturedMovieCard';

interface FeaturedMoviesSectionProps {
  peliculasDestacadas: Pelicula[];
  onMoviePress: (peliculaId: string) => void;
}

export default function FeaturedMoviesSection({
  peliculasDestacadas,
  onMoviePress,
}: FeaturedMoviesSectionProps) {
  if (peliculasDestacadas.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Star size={20} color="#EAB308" fill="#EAB308" />
          <Text className="ml-2 text-xl font-bold text-white">Películas Destacadas</Text>
        </View>
        <View className="flex-row items-center">
          <Film size={16} color="#9CA3AF" />
          <Text className="ml-1 text-sm text-gray-400">{peliculasDestacadas.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, gap: 0 }}
        nestedScrollEnabled={true}>
        {peliculasDestacadas.map((pelicula) => (
          <FeaturedMovieCard
            key={pelicula.id}
            pelicula={pelicula}
            onPress={() => onMoviePress(pelicula.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
