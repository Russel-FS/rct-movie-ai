import { View, Text, ScrollView } from 'react-native';
import { BarChart3, TrendingUp, Users, Film, MapPin } from 'lucide-react-native';

export default function EstadisticasAdmin() {
  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold text-white">Dashboard</Text>
          <Text className="text-gray-400">Resumen de estadísticas del sistema</Text>
        </View>

        {/* Cards de estadísticas */}
        <View className="mb-6 flex-row flex-wrap justify-between">
          <View className="mb-4 w-[48%] rounded-lg bg-gray-800 p-4">
            <View className="mb-2 flex-row items-center">
              <Film size={20} color="#3B82F6" />
              <Text className="ml-2 text-sm font-bold text-gray-300">Películas</Text>
            </View>
            <Text className="text-2xl font-bold text-white">24</Text>
            <Text className="text-xs text-gray-400">+3 este mes</Text>
          </View>

          <View className="mb-4 w-[48%] rounded-lg bg-gray-800 p-4">
            <View className="mb-2 flex-row items-center">
              <MapPin size={20} color="#F59E0B" />
              <Text className="ml-2 text-sm font-bold text-gray-300">Cines</Text>
            </View>
            <Text className="text-2xl font-bold text-white">8</Text>
            <Text className="text-xs text-gray-400">+1 este mes</Text>
          </View>

          <View className="mb-4 w-[48%] rounded-lg bg-gray-800 p-4">
            <View className="mb-2 flex-row items-center">
              <Users size={20} color="#8B5CF6" />
              <Text className="ml-2 text-sm font-bold text-gray-300">Usuarios</Text>
            </View>
            <Text className="text-2xl font-bold text-white">1,234</Text>
            <Text className="text-xs text-gray-400">+45 esta semana</Text>
          </View>

          <View className="mb-4 w-[48%] rounded-lg bg-gray-800 p-4">
            <View className="mb-2 flex-row items-center">
              <TrendingUp size={20} color="#10B981" />
              <Text className="ml-2 text-sm font-bold text-gray-300">Ventas</Text>
            </View>
            <Text className="text-2xl font-bold text-white">$12,450</Text>
            <Text className="text-xs text-gray-400">+8% vs mes anterior</Text>
          </View>
        </View>

        {/* Placeholder para gráficos */}
        <View className="mb-6 rounded-lg bg-gray-800 p-6">
          <View className="mb-4 flex-row items-center">
            <BarChart3 size={24} color="#3B82F6" />
            <Text className="ml-2 text-lg font-bold text-white">Análisis Detallado</Text>
          </View>
          <View className="items-center justify-center py-12">
            <BarChart3 size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">Gráficos en desarrollo</Text>
            <Text className="text-center text-sm text-gray-500">
              Aquí se mostrarán gráficos detallados de ventas,{'\n'}
              ocupación de salas y tendencias.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
