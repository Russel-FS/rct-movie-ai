import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Search, Star, Clock, Users, Film, RefreshCw } from 'lucide-react-native';
import { usePeliculas } from '../hooks/usePeliculas';
import { Pelicula } from '~/shared/types';

// Props para el componente MovieCard
interface MovieCardProps {
  pelicula: Pelicula;
}

export default function Home() {
  // Hook personalizado para manejar películas
  const {
    filteredPeliculas,
    peliculasDestacadas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
  } = usePeliculas();

  // Función para formatear duración
  const formatDuration = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  // Componente para tarjetas destacadas (horizontal)
  const FeaturedMovieCard: React.FC<MovieCardProps> = ({ pelicula }) => (
    <TouchableOpacity className="mr-3 w-48 rounded-lg bg-gray-800 p-3">
      {/* Miniatura de la película */}
      <Image
        source={{
          uri: pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        }}
        className="mb-3 h-64 w-full rounded-lg"
        resizeMode="cover"
      />

      {/* Badge destacada */}
      <View className="absolute right-1 top-1 flex-row items-center rounded bg-yellow-500 px-2 py-1">
        <Star size={12} color="#000000" fill="#000000" />
        <Text className="ml-1 text-xs font-bold text-black">Destacada</Text>
      </View>

      {/* Título de la película */}
      <Text className="mb-1 text-base font-bold text-white" numberOfLines={2}>
        {pelicula.titulo}
      </Text>

      {/* Información adicional */}
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

  // Componente para tarjetas del grid principal
  const MovieCard: React.FC<MovieCardProps> = ({ pelicula }) => (
    <TouchableOpacity className="mx-2 mb-4 flex-1 rounded-lg bg-gray-800 p-4">
      {/* Miniatura de la película */}
      <Image
        source={{
          uri: pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
        }}
        className="mb-3 h-48 w-full rounded-lg"
        resizeMode="cover"
      />

      {/* Título de la película */}
      <Text className="mb-1 text-lg font-bold text-white" numberOfLines={2}>
        {pelicula.titulo}
      </Text>

      {/* Subtítulo */}
      <Text className="mb-2 text-sm text-gray-400" numberOfLines={1}>
        {pelicula.titulo_original || pelicula.titulo}
      </Text>

      {/* Información adicional */}
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

      {/* Mostrar si es destacada */}
      {pelicula.destacada && (
        <View className="absolute right-2 top-2 flex-row items-center rounded bg-yellow-500 px-2 py-1">
          <Star size={10} color="#000000" fill="#000000" />
          <Text className="ml-1 text-xs font-bold text-black">Destacada</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Mostrar loading
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando películas...</Text>
      </View>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <Text className="mb-4 text-center text-red-500">Error: {error}</Text>
        <TouchableOpacity
          onPress={refetch}
          className="flex-row items-center rounded-lg bg-blue-600 px-6 py-3">
          <RefreshCw size={16} color="#ffffff" />
          <Text className="ml-2 font-bold text-white">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header fijo */}
      <View className="px-4 pb-4 pt-14">
        <Text className="mb-1 text-sm text-gray-400">Cine Estelar</Text>
        <Text className="mb-4 text-2xl font-bold text-white">Películas en Cartelera</Text>
        <Text className="mb-4 text-sm text-gray-400">
          {filteredPeliculas.length} película{filteredPeliculas.length !== 1 ? 's' : ''} disponible
          {filteredPeliculas.length !== 1 ? 's' : ''}
        </Text>

        {/* Barra de búsqueda */}
        <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Buscar películas..."
            placeholderTextColor="#9CA3AF"
            className="ml-3 flex-1 text-white"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* Sección de películas destacadas */}
        {peliculasDestacadas.length > 0 && !searchTerm && (
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
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
              nestedScrollEnabled={true}>
              {peliculasDestacadas.map((pelicula) => (
                <FeaturedMovieCard key={pelicula.id} pelicula={pelicula} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Título de la sección principal */}
        {filteredPeliculas.length > 0 && (
          <View className="mb-4 flex-row items-center justify-between px-4">
            <View className="flex-row items-center">
              <Film size={18} color="#ffffff" />
              <Text className="ml-2 text-lg font-bold text-white">
                {searchTerm ? `Resultados de búsqueda` : 'Todas las Películas'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Users size={14} color="#9CA3AF" />
              <Text className="ml-1 text-sm text-gray-400">{filteredPeliculas.length}</Text>
            </View>
          </View>
        )}

        {/* Grid de películas */}
        {filteredPeliculas.length > 0 ? (
          <View className="flex-row flex-wrap justify-between px-2">
            {filteredPeliculas.map((pelicula) => (
              <View key={pelicula.id} className="w-1/2">
                <MovieCard pelicula={pelicula} />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <Text className="mb-2 text-lg text-gray-400">No se encontraron películas</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay películas disponibles'}
            </Text>
          </View>
        )}

        {/* Espacio adicional al final */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
