import { Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Cartelera() {
  return (
    <ScrollView className="flex-1">
      <View className="px-4 py-6">
        <View className="mb-6 flex-row items-center">
          <Ionicons name="film-outline" size={24} color="white" />
          <Text className="ml-2 text-2xl font-bold text-white">Cartelera</Text>
        </View>

        <View className="mb-4 rounded-lg bg-gray-800 p-4">
          <Text className="mb-2 text-lg font-semibold text-white">Películas en cartelera</Text>
          <Text className="text-gray-300">
            Aquí encontrarás todas las películas disponibles actualmente en nuestros cines.
          </Text>
        </View>

        <View className="space-y-4">
          {[1, 2, 3].map((item) => (
            <View key={item} className="rounded-lg bg-gray-800 p-4">
              <View className="mb-3 h-40 rounded-md bg-gray-700" />
              <Text className="text-lg font-semibold text-white">Título de Película {item}</Text>
              <Text className="mt-1 text-gray-400">Género • Duración</Text>
              <View className="mt-2 flex-row">
                <View className="mr-2 rounded-full bg-gray-700 px-3 py-1">
                  <Text className="text-xs text-white">Horarios</Text>
                </View>
                <View className="rounded-full bg-gray-700 px-3 py-1">
                  <Text className="text-xs text-white">Comprar</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
