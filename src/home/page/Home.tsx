import { View, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePeliculas } from '../hooks/usePeliculas';
import { useMovieStats } from '../hooks/useMovieStats';
import { RootStackParamList } from '~/shared/types/navigation';
import {
  HomeHeader,
  HeroSection,
  StatsSection,
  GenreSection,
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
    loading: peliculasLoading,
    error: peliculasError,
    searchTerm,
    setSearchTerm,
    refetch: refetchPeliculas,
  } = usePeliculas();

  const {
    stats,
    generos,
    peliculasPorGenero,
    loading: statsLoading,
    error: statsError,
  } = useMovieStats();

  const loading = peliculasLoading || statsLoading;
  const error = peliculasError || statsError;

  const handleMoviePress = (peliculaId: string) => {
    navigation.navigate('SeleccionLugar', { peliculaId });
  };

  const handleNotificationsPress = () => {
    console.log('Notificaciones pressed');
  };

  const handleProfilePress = () => {
    console.log('Perfil pressed');
  };

  const handleViewAllGenre = (generoId: number) => {
    console.log('Ver todo género:', generoId);
  };

  const handleRefresh = async () => {
    await refetchPeliculas();
  };

  if (loading && filteredPeliculas.length === 0) {
    return <LoadingState message="Cargando experiencia cinematográfica..." />;
  }

  if (error && filteredPeliculas.length === 0) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  const heroPelicula = peliculasDestacadas[0] || filteredPeliculas[0];

  return (
    <View className="flex-1 bg-black">
      <HomeHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNotificationsPress={handleNotificationsPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }>
        {/* Hero Section*/}
        {!searchTerm && heroPelicula && (
          <HeroSection
            pelicula={heroPelicula}
            onPlayPress={() => handleMoviePress(heroPelicula.id)}
            onInfoPress={() => handleMoviePress(heroPelicula.id)}
          />
        )}

        {/* Estadísticas*/}
        {!searchTerm && (
          <StatsSection
            totalPeliculas={stats.totalPeliculas}
            peliculasEstreno={stats.peliculasEstreno}
            peliculasDestacadas={stats.peliculasDestacadas}
            promedioCalificacion={stats.promedioCalificacion}
          />
        )}

        {/* Secciones por género*/}
        {!searchTerm &&
          generos.map((genero) => (
            <GenreSection
              key={genero.id}
              genero={genero}
              peliculas={peliculasPorGenero[genero.id] || []}
              onMoviePress={handleMoviePress}
              onViewAllPress={handleViewAllGenre}
            />
          ))}

        {/* Grid de resultados de búsqueda */}
        {searchTerm && (
          <MoviesGrid
            peliculas={filteredPeliculas}
            searchTerm={searchTerm}
            onMoviePress={handleMoviePress}
          />
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
