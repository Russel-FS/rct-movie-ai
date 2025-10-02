import { View, Text } from 'react-native';
import SearchBar from './SearchBar';

interface HomeHeaderProps {
  totalMovies: number;
  searchTerm: string;
  onSearchChange: (text: string) => void;
}

export default function HomeHeader({ totalMovies, searchTerm, onSearchChange }: HomeHeaderProps) {
  return (
    <View className="px-4 pb-4 pt-14">
      <Text className="mb-1 text-sm text-gray-400">Cine Estelar</Text>
      <Text className="mb-4 text-2xl font-bold text-white">Películas en Cartelera</Text>
      <Text className="mb-4 text-sm text-gray-400">
        {totalMovies} película{totalMovies !== 1 ? 's' : ''} disponible
        {totalMovies !== 1 ? 's' : ''}
      </Text>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Buscar películas..."
      />
    </View>
  );
}
