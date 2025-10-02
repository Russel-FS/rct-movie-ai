import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Film } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { RootStackParamList } from '~/shared/types/navigation';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '../services/pelicula.service';
import { GeneroService } from '../services/genero.service';
import { MoviesGrid, LoadingState, ErrorState } from '../components';

type GenreMoviesRouteProp = RouteProp<RootStackParamList, 'GenreMovies'>;
type GenreMoviesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GenreMovies'>;

export default function GenreMovies() {
  const navigation = useNavigation<GenreMoviesNavigationProp>();
  const route = useRoute<GenreMoviesRouteProp>();
  const { generoId } = route.params;

  const [genero, setGenero] = useState<GeneroMovie | null>(null);
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [generoData, peliculasData] = await Promise.all([
          GeneroService.getGeneroById(generoId),
          PeliculaService.getPeliculasPorGenero(generoId),
        ]);

        setGenero(generoData);
        setPeliculas(peliculasData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar películas del género');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [generoId]);

  const handleMoviePress = (peliculaId: string) => {
    navigation.navigate('SeleccionLugar', { peliculaId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return <LoadingState message="Cargando películas del género..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header personalizado */}
      <View className="px-4 pb-6 pt-14">
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-xl"
            activeOpacity={0.8}>
            <ArrowLeft size={20} color="#FFF" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">{genero?.nombre || 'Género'}</Text>
            {genero?.descripcion && (
              <Text className="mt-1 text-sm text-gray-400">{genero.descripcion}</Text>
            )}
          </View>
        </View>

        {/* Stats del género */}
        <View className="rounded-2xl border border-gray-800/30 bg-gray-900/50 p-4 backdrop-blur-xl">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <Film size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-lg font-bold text-white">{peliculas.length}</Text>
              <Text className="text-sm text-gray-400">
                Película{peliculas.length !== 1 ? 's' : ''} disponible
                {peliculas.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Grid de películas */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <MoviesGrid peliculas={peliculas} searchTerm="" onMoviePress={handleMoviePress} />
      </ScrollView>
    </View>
  );
}
