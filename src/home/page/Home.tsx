import React, { useState, useMemo } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

// Definir la interfaz para el tipo Movie
interface Movie {
  id: number;
  title: string;
  subtitle: string;
  genre: string;
  rating: number;
  duration: string;
}

// Props para el componente MovieCard
interface MovieCardProps {
  movie: Movie;
}

export default function Home() {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Datos de ejemplo de las películas
  const movies: Movie[] = [
    {
      id: 1,
      title: 'Dune 2',
      subtitle: 'Dune: Parte Dos',
      genre: 'Ciencia Ficción',
      rating: 8.5,
      duration: '2h 46m'
    },
    {
      id: 2,
      title: 'Oppenheimer',
      subtitle: 'Oppenheimer',
      genre: 'Biografía',
      rating: 8.3,
      duration: '3h 0m'
    },
    {
      id: 3,
      title: 'Spider-Man',
      subtitle: 'Spider-Man',
      genre: 'Acción',
      rating: 7.8,
      duration: '2h 28m'
    },
    {
      id: 4,
      title: 'John Wick 4',
      subtitle: 'John Wick 4',
      genre: 'Acción',
      rating: 7.9,
      duration: '2h 49m'
    }
  ];

  // Filtrar películas basado en el término de búsqueda
  const filteredMovies = useMemo(() => {
    if (!searchTerm.trim()) {
      return movies;
    }
    
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, movies]);

  const MovieCard: React.FC<MovieCardProps> = ({ movie }) => (
    <TouchableOpacity className="bg-gray-800 rounded-lg p-4 mb-4 mx-2 flex-1">
      {/* Placeholder para imagen de película */}
      <View className="bg-gray-700 rounded-lg h-48 mb-3 items-center justify-center">
        <View className="w-12 h-12 bg-gray-600 rounded-full items-center justify-center">
          <View className="w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-l-white border-t-transparent border-b-transparent ml-1" />
        </View>
      </View>
      
      {/* Título de la película */}
      <Text className="text-white text-lg font-bold mb-1">{movie.title}</Text>
      
      {/* Subtítulo */}
      <Text className="text-gray-400 text-sm mb-2">{movie.subtitle}</Text>
      
      {/* Información adicional */}
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-xs">{movie.genre}</Text>
        <View className="flex-row items-center">
          <Text className="text-yellow-500 text-xs font-bold mr-1">★</Text>
          <Text className="text-white text-xs">{movie.rating}</Text>
        </View>
      </View>
      
      <Text className="text-gray-400 text-xs mt-1">{movie.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-14 px-4 pb-4">
        <Text className="text-gray-400 text-sm mb-1">Cine Estelar</Text>
        <Text className="text-white text-2xl font-bold mb-4">Películas en Cartelera</Text>
        <Text className="text-gray-400 text-sm mb-4">Descubre las últimas películas</Text>
        
        {/* Barra de búsqueda */}
        <View className="bg-gray-800 rounded-lg flex-row items-center px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Buscar películas..."
            placeholderTextColor="#9CA3AF"
            className="text-white ml-3 flex-1"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Grid de películas */}
      <ScrollView className="flex-1 px-2" showsVerticalScrollIndicator={false}>
        {filteredMovies.length > 0 ? (
          <View className="flex-row flex-wrap justify-between">
            {filteredMovies.map((movie, index) => (
              <View key={movie.id} className="w-1/2">
                <MovieCard movie={movie} />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-gray-400 text-lg mb-2">No se encontraron películas</Text>
            <Text className="text-gray-500 text-sm text-center px-8">
              Intenta con otro término de búsqueda
            </Text>
          </View>
        )}
        
        {/* Espacio adicional al final */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}