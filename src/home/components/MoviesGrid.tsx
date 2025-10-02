import { View, Text } from 'react-native';
import { Film, Users } from 'lucide-react-native';
import { Pelicula } from '~/shared/types/pelicula';
import MovieCard from './MovieCard';

interface MoviesGridProps {
  peliculas: Pelicula[];
  searchTerm: string;
  onMoviePress: (peliculaId: string) => void;
}

export default function MoviesGrid({ peliculas, searchTerm, onMoviePress }: MoviesGridProps) {
  if (peliculas.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="mb-2 text-lg text-gray-400">No se encontraron películas</Text>
        <Text className="px-8 text-center text-sm text-gray-500">
          {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay películas disponibles'}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Film size={18} color="#ffffff" />
          <Text className="ml-2 text-lg font-bold text-white">
            {searchTerm ? `Resultados de búsqueda` : 'Todas las Películas'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Users size={14} color="#9CA3AF" />
          <Text className="ml-1 text-sm text-gray-400">{peliculas.length}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap px-4" style={{ gap: 16 }}>
        {peliculas.map((pelicula) => (
          <View key={pelicula.id} style={{ width: '47%' }}>
            <MovieCard pelicula={pelicula} onPress={() => onMoviePress(pelicula.id)} />
          </View>
        ))}
      </View>
    </>
  );
}
