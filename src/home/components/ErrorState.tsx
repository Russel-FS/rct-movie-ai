import { View, Text, TouchableOpacity } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-black px-4">
      <Text className="mb-4 text-center text-red-500">Error: {error}</Text>
      <TouchableOpacity
        onPress={onRetry}
        className="flex-row items-center rounded-lg bg-blue-600 px-6 py-3">
        <RefreshCw size={16} color="#ffffff" />
        <Text className="ml-2 font-bold text-white">Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}
