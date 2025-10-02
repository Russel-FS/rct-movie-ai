import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import MovieCard from './MovieCard';

interface GenreSectionProps {
  genero: GeneroMovie;
  peliculas: Pelicula[];
  onMoviePress: (peliculaId: string) => void;
  onViewAllPress: (generoId: number) => void;
}

export default function GenreSection({
  genero,
  peliculas,
  onMoviePress,
  onViewAllPress,
}: GenreSectionProps) {
  if (peliculas.length === 0) return null;

  return (
    <View className="mb-8">
      {/* Header de la sección */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View>
          <Text className="text-xl font-bold text-white">{genero.nombre}</Text>
          {genero.descripcion && (
            <Text className="mt-1 text-sm text-gray-400">{genero.descripcion}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onViewAllPress(genero.id)}
          className="flex-row items-center rounded-full bg-gray-800/50 px-3 py-2"
          activeOpacity={0.7}>
          <Text className="mr-1 text-sm font-semibold text-blue-400">Ver Todo</Text>
          <ChevronRight size={16} color="#60A5FA" />
        </TouchableOpacity>
      </View>

      {/* Scroll horizontal de películas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, gap: 16 }}>
        {peliculas.map((pelicula) => (
          <View key={pelicula.id} style={{ width: 180 }}>
            <MovieCard pelicula={pelicula} onPress={() => onMoviePress(pelicula.id)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
