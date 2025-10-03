import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import {
  Film,
  Tag,
  MapPin,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Armchair,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Importar los componentes CRUD
import PeliculaCRUD from './PeliculaCRUD';
import GeneroCRUD from './GeneroCRUD';
import CineCRUD from './CineCRUD';
import SalaCRUD from './SalaCRUD';
import UsuarioCRUD from './UsuarioCRUD';
import EstadisticasAdmin from './EstadisticasAdmin';

type TabType = 'peliculas' | 'generos' | 'cines' | 'salas' | 'usuarios' | 'estadisticas';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  color: string;
}

const tabs: TabConfig[] = [
  {
    id: 'peliculas',
    label: 'Películas',
    icon: Film,
    component: PeliculaCRUD,
    color: '#3B82F6',
  },
  {
    id: 'generos',
    label: 'Géneros',
    icon: Tag,
    component: GeneroCRUD,
    color: '#10B981',
  },
  {
    id: 'cines',
    label: 'Cines',
    icon: MapPin,
    component: CineCRUD,
    color: '#F59E0B',
  },
  {
    id: 'salas',
    label: 'Salas',
    icon: Armchair,
    component: SalaCRUD,
    color: '#EC4899',
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: Users,
    component: UsuarioCRUD,
    color: '#8B5CF6',
  },
  {
    id: 'estadisticas',
    label: 'Estadísticas',
    icon: BarChart3,
    component: EstadisticasAdmin,
    color: '#EF4444',
  },
];

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('peliculas');

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="border-b border-gray-800 bg-black px-4 pb-4 pt-2">
        <View className="mb-4 flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800"
            activeOpacity={0.7}>
            <ChevronLeft size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-400">Panel de Control</Text>
            <Text className="text-2xl font-bold text-white">Administración</Text>
          </View>
          <View className="rounded-full bg-gray-800 p-2">
            <Settings size={20} color="#9CA3AF" />
          </View>
        </View>

        {/* Tabs de navegación */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 16 }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`mr-3 flex-row items-center rounded-full px-4 py-3 ${
                  isActive ? 'bg-white' : 'bg-gray-800'
                }`}
                activeOpacity={0.8}>
                <IconComponent size={18} color={isActive ? tab.color : '#9CA3AF'} />
                <Text className={`ml-2 font-semibold ${isActive ? 'text-black' : 'text-gray-300'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <View className="flex-1">{ActiveComponent && <ActiveComponent />}</View>
    </SafeAreaView>
  );
}
