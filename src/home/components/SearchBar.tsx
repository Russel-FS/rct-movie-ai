import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = 'Buscar películas...',
}: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
      <Search size={20} color="#9CA3AF" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="ml-3 flex-1 text-white"
        value={searchTerm}
        onChangeText={onSearchChange}
      />
    </View>
  );
}
