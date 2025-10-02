import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, User } from 'lucide-react-native';
import SearchBar from './SearchBar';

interface HomeHeaderProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export default function HomeHeader({
  searchTerm,
  onSearchChange,
  onNotificationsPress,
  onProfilePress,
}: HomeHeaderProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <View className="px-4 pb-6 pt-14">
      {/* Top bar */}
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-gray-400">{greeting}</Text>
          <Text className="text-2xl font-bold text-white">¿Qué vamos a ver hoy?</Text>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onNotificationsPress}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-800/50"
            activeOpacity={0.7}>
            <Bell size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onProfilePress}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-800/50"
            activeOpacity={0.7}>
            <User size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de búsqueda mejorada */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Buscar películas, géneros, directores..."
      />
    </View>
  );
}
