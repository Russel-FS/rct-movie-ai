import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

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
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <View className="flex-row items-center rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 backdrop-blur-xl">
      <Search size={20} color="#9CA3AF" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="ml-3 flex-1 text-base text-white"
        value={searchTerm}
        onChangeText={onSearchChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={clearSearch}
          className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-600"
          activeOpacity={0.7}>
          <X size={14} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
