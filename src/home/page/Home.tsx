import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePeliculas } from '../hooks/usePeliculas';
import { RootStackParamList } from '~/shared/types/navigation';
import {
  HomeHeader,
  FeaturedMoviesSection,
  MoviesGrid,
  LoadingState,
  ErrorState,
} from '../components';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const {
    filteredPeliculas,
    peliculasDestacadas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
  } = usePeliculas();

  const handleMoviePress = (peliculaId: string) => {
    navigation.navigate('SeleccionLugar', { peliculaId });
  };

  if (loading) {
    return <LoadingState message="Cargando películas..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <View className="flex-1 bg-black">
      <HomeHeader
        totalMovies={filteredPeliculas.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        {!searchTerm && (
          <FeaturedMoviesSection
            peliculasDestacadas={peliculasDestacadas}
            onMoviePress={handleMoviePress}
          />
        )}

        {/* Grid de todas las películas */}
        <MoviesGrid
          peliculas={filteredPeliculas}
          searchTerm={searchTerm}
          onMoviePress={handleMoviePress}
        />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
