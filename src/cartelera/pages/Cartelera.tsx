import { View, Text, ScrollView } from 'react-native';
import { Film, Calendar, Clock } from 'lucide-react-native';

export default function Cartelera() {
  return (
    <View className="flex-1 bg-black">
      <View className="px-4 pb-4 pt-14">
        <Text className="mb-1 text-sm text-gray-400">Cine Estelar</Text>
        <Text className="mb-4 text-2xl font-bold text-white">Cartelera</Text>
        <Text className="text-sm text-gray-300">
          Próximamente: Vista completa de la cartelera con horarios
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="items-center justify-center py-20">
          <View className="mb-6 rounded-full bg-gray-800 p-6">
            <Film size={48} color="#9CA3AF" />
          </View>
          <Text className="mb-2 text-xl font-bold text-white">Cartelera en Desarrollo</Text>
          <Text className="mb-4 text-center text-gray-400">
            Esta sección mostrará todos los horarios{'\n'}y funciones disponibles
          </Text>

          <View className="w-full rounded-lg bg-gray-800 p-4">
            <Text className="mb-3 text-lg font-bold text-white">Próximas funcionalidades:</Text>

            <View className="mb-2 flex-row items-center">
              <Calendar size={16} color="#3B82F6" />
              <Text className="ml-3 text-gray-300">Vista por fechas</Text>
            </View>

            <View className="mb-2 flex-row items-center">
              <Clock size={16} color="#3B82F6" />
              <Text className="ml-3 text-gray-300">Horarios por cine</Text>
            </View>

            <View className="flex-row items-center">
              <Film size={16} color="#3B82F6" />
              <Text className="ml-3 text-gray-300">Filtros por género</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
