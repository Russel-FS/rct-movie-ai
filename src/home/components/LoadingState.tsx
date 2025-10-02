import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Cargando películas...' }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="mt-4 text-white">{message}</Text>
    </View>
  );
}
