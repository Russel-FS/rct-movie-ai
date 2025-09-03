import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Search, Star } from 'lucide-react-native';

const Inicio = () => {
  const [activeFilter, setActiveFilter] = useState('Para ti');

  const filterTabs = ['Para ti', 'Tendencias', 'Estrenos', 'Clásicos', 'Acción', 'Comedia'];
  
  const trendingMovies = [
    {
      title: 'Dune: Part Two',
      year: '2024',
      genre: 'Sci-Fi',
      rating: '8.9',
      match: '95% Match',
      emoji: '🏜️',
      badge: 'HOT'
    },
    {
      title: 'Oppenheimer',
      year: '2023',
      genre: 'Drama',
      rating: '8.5',
      match: '89% Match',
      emoji: '⚛️'
    },
    {
      title: 'Spider-Verse',
      year: '2023',
      genre: 'Animation',
      rating: '9.1',
      match: '92% Match',
      emoji: '🕷️',
      badge: 'NEW'
    }
  ];

  const recommendedMovies = [
    {
      title: 'Blade Runner 2049',
      year: '2017',
      genre: 'Sci-Fi',
      rating: '8.0',
      match: '94% Match',
      emoji: '🌆'
    },
    {
      title: 'The Prestige',
      year: '2006',
      genre: 'Thriller',
      rating: '8.5',
      match: '91% Match',
      emoji: '🎭'
    }
  ];

  return (
    <View className="flex-1 bg-primary-dark">
      {/* Search Section */}
      <View className="bg-secondary-dark px-6 py-8">
        <View className="relative mb-6">
          <TextInput
            className="w-full h-13 px-5 pr-14 bg-card-bg border border-border-primary rounded-2xl text-text-primary text-base"
            placeholder="Buscar películas, series, actores..."
            placeholderTextColor="#71717a"
          />
          <Search className="absolute right-4 top-4 w-5 h-5 text-text-muted" />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-xl border ${
                  activeFilter === tab
                    ? 'bg-text-accent border-transparent'
                    : 'border-border-secondary bg-transparent'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  activeFilter === tab ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        {/* AI Recommendation */}
        <View className="bg-card-bg bg-opacity-70 border border-border-accent rounded-3xl p-6 mb-10 mt-8">
          <View className="flex-row items-center space-x-3 mb-4">
            <View className="w-8 h-8 bg-text-accent rounded-lg items-center justify-center">
              <Text className="text-text-primary text-sm font-semibold">AI</Text>
            </View>
            <Text className="text-text-primary text-base font-semibold">Recomendación personalizada</Text>
          </View>
          
          <Text className="text-text-secondary text-sm mb-4 leading-6">
            Basándome en tu historial y preferencias, he encontrado la película perfecta para ti esta noche.
          </Text>
          
          <TouchableOpacity className="flex-row items-center space-x-4 p-4 bg-glass border border-border-primary rounded-2xl">
            <View className="w-15 h-22 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl items-center justify-center">
              <Text className="text-3xl">🧠</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary text-base font-semibold mb-1">Inception</Text>
              <Text className="text-text-muted text-xs mb-2">2010 • Sci-Fi • Christopher Nolan</Text>
              <View className="bg-success px-2 py-1 rounded-lg flex-row items-center space-x-1 self-start">
                <Star className="w-3 h-3 text-text-primary" fill="white" />
                <Text className="text-text-primary text-xs font-semibold">98% Match</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trending Section */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-text-primary text-xl font-bold">Tendencias</Text>
          <TouchableOpacity>
            <Text className="text-text-accent text-sm font-medium">Ver todo</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10">
          <View className="flex-row space-x-4">
            {trendingMovies.map((movie, index) => (
              <TouchableOpacity key={index} className="w-36">
                <View className="bg-card-bg border border-border-primary rounded-3xl overflow-hidden">
                  <View className="w-full h-50 bg-gradient-to-br from-gray-700 to-gray-600 items-center justify-center relative">
                    <Text className="text-4xl text-white text-opacity-60">{movie.emoji}</Text>
                    {movie.badge && (
                      <View className={`absolute top-3 right-3 px-2 py-1 rounded-lg ${
                        movie.badge === 'HOT' ? 'bg-hot-badge' : 'bg-success'
                      }`}>
                        <Text className="text-text-primary text-xs font-semibold">{movie.badge}</Text>
                      </View>
                    )}
                  </View>
                  <View className="p-4">
                    <Text className="text-text-primary text-base font-semibold mb-2 leading-5">{movie.title}</Text>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-text-muted text-xs">{movie.year} • {movie.genre}</Text>
                      <View className="bg-warning px-2 py-1 rounded-lg flex-row items-center space-x-1">
                        <Star className="w-3 h-3 text-gray-900" fill="#1f2937" />
                        <Text className="text-gray-900 text-xs font-semibold">{movie.rating}</Text>
                      </View>
                    </View>
                    <View className="bg-accent-overlay border border-accent-border rounded-xl py-2 px-3">
                      <Text className="text-text-accent text-xs font-medium text-center">{movie.match}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Recommended for You */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-text-primary text-xl font-bold">Recomendadas para ti</Text>
          <TouchableOpacity>
            <Text className="text-text-accent text-sm font-medium">Ver todo</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-between mb-24">
          {recommendedMovies.map((movie, index) => (
            <TouchableOpacity key={index} className="w-40">
              <View className="bg-card-bg border border-border-primary rounded-3xl overflow-hidden">
                <View className="w-full h-55 bg-gradient-to-br from-gray-700 to-gray-600 items-center justify-center">
                  <Text className="text-4xl text-white text-opacity-60">{movie.emoji}</Text>
                </View>
                <View className="p-4">
                  <Text className="text-text-primary text-base font-semibold mb-2 leading-5">{movie.title}</Text>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-text-muted text-xs">{movie.year} • {movie.genre}</Text>
                    <View className="bg-warning px-2 py-1 rounded-lg flex-row items-center space-x-1">
                      <Star className="w-3 h-3 text-gray-900" fill="#1f2937" />
                      <Text className="text-gray-900 text-xs font-semibold">{movie.rating}</Text>
                    </View>
                  </View>
                  <View className="bg-accent-overlay border border-accent-border rounded-xl py-2 px-3">
                    <Text className="text-text-accent text-xs font-medium text-center">{movie.match}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Inicio;