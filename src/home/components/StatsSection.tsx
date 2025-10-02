import { View, Text } from 'react-native';
import { Film, Star, Calendar, TrendingUp } from 'lucide-react-native';

interface StatsSectionProps {
  totalPeliculas: number;
  peliculasEstreno: number;
  peliculasDestacadas: number;
  promedioCalificacion: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

const StatCard = ({ icon, value, label, color }: StatCardProps) => (
  <View className="mx-1 flex-1 rounded-2xl bg-gray-900/50 p-4 backdrop-blur-xl">
    <View className={`mb-3 h-10 w-10 items-center justify-center rounded-full ${color}`}>
      {icon}
    </View>
    <Text className="mb-1 text-2xl font-bold text-white">{value}</Text>
    <Text className="text-xs font-medium text-gray-400">{label}</Text>
  </View>
);

export default function StatsSection({
  totalPeliculas,
  peliculasEstreno,
  peliculasDestacadas,
  promedioCalificacion,
}: StatsSectionProps) {
  return (
    <View className="mb-8 px-4">
      <Text className="mb-4 text-xl font-bold text-white">En Cartelera</Text>

      <View className="flex-row">
        <StatCard
          icon={<Film size={20} color="#3B82F6" />}
          value={totalPeliculas.toString()}
          label="Películas Disponibles"
          color="bg-blue-500/20"
        />

        <StatCard
          icon={<Calendar size={20} color="#10B981" />}
          value={peliculasEstreno.toString()}
          label="Estrenos Recientes"
          color="bg-emerald-500/20"
        />

        <StatCard
          icon={<Star size={20} color="#F59E0B" />}
          value={peliculasDestacadas.toString()}
          label="Destacadas"
          color="bg-amber-500/20"
        />

        <StatCard
          icon={<TrendingUp size={20} color="#EF4444" />}
          value={promedioCalificacion.toFixed(1)}
          label="Calificación Promedio"
          color="bg-red-500/20"
        />
      </View>
    </View>
  );
}
