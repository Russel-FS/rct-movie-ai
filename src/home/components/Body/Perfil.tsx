import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, /*Image*/ } from 'react-native';
import { 
  Settings, 
  Edit3, 
  Star, 
  Clock, 
  /*Heart, */
  Download, 
  Bell, 
  Shield, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react-native';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState('Actividad');

  const tabs = ['Actividad', 'Favoritos', 'Listas', 'Descargas'];

  const userStats = [
    {
      icon: Star,
      label: 'Calificaciones',
      value: '127',
      color: 'text-warning'
    },
    {
      icon: Clock,
      label: 'Horas vistas',
      value: '342h',
      color: 'text-text-accent'
    },
    {
      icon: Award,
      label: 'Insignias',
      value: '8',
      color: 'text-success'
    },
    {
      icon: TrendingUp,
      label: 'Racha actual',
      value: '12 días',
      color: 'text-hot-badge'
    }
  ];

  const recentActivity = [
    {
      title: 'The Batman',
      action: 'Calificó con 5 estrellas',
      time: 'Hace 2 horas',
      emoji: '🦇',
      type: 'rating'
    },
    {
      title: 'Stranger Things 4',
      action: 'Terminó de ver',
      time: 'Ayer',
      emoji: '🔮',
      type: 'completed'
    },
    {
      title: 'Top Gun: Maverick',
      action: 'Agregó a favoritos',
      time: 'Hace 3 días',
      emoji: '✈️',
      type: 'favorite'
    },
    {
      title: 'Avatar: The Way of Water',
      action: 'Agregó a lista "Por ver"',
      time: 'Hace 1 semana',
      emoji: '🌊',
      type: 'watchlist'
    }
  ];

  const menuOptions = [
    {
      icon: Bell,
      title: 'Notificaciones',
      subtitle: 'Gestiona tus alertas',
      hasSwitch: true
    },
    {
      icon: Download,
      title: 'Descargas',
      subtitle: '3 películas descargadas',
      hasArrow: true
    },
    {
      icon: Shield,
      title: 'Privacidad',
      subtitle: 'Control de datos',
      hasArrow: true
    },
    {
      icon: HelpCircle,
      title: 'Ayuda y soporte',
      subtitle: 'FAQ y contacto',
      hasArrow: true
    }
  ];

/*interface UserStat {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    color: string;
}*/

interface Activity {
    title: string;
    action: string;
    time: string;
    emoji: string;
    type: 'rating' | 'completed' | 'favorite' | 'watchlist' | string;
}

/*interface MenuOption {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    hasSwitch?: boolean;
    hasArrow?: boolean;
}*/

const getActivityTypeColor = (type: Activity['type']): string => {
    switch (type) {
        case 'rating': return 'bg-warning';
        case 'completed': return 'bg-success';
        case 'favorite': return 'bg-red-500';
        case 'watchlist': return 'bg-text-accent';
        default: return 'bg-text-muted';
    }
};

  return (
    <View className="flex-1 bg-primary-dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con información del usuario */}
        <View className="bg-secondary-dark pt-12 pb-8 px-6">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row items-center space-x-4">
              {/* Avatar */}
              <View className="w-20 h-20 bg-gradient-to-br from-text-accent to-purple-600 rounded-full items-center justify-center">
                <Text className="text-2xl">👤</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-text-primary text-xl font-bold mb-1">James Velezmoro</Text>
                <Text className="text-text-secondary text-sm mb-2">@jamesjnvn</Text>
                <View className="flex-row items-center space-x-2">
                  <View className="bg-success px-2 py-1 rounded-lg">
                    <Text className="text-text-primary text-xs font-semibold">Pro</Text>
                  </View>
                  <View className="flex-row items-center space-x-1">
                    <Calendar className="w-3 h-3 text-text-muted" />
                    <Text className="text-text-muted text-xs">Miembro desde 2022</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity className="p-2">
              <Settings className="w-6 h-6 text-text-secondary" />
            </TouchableOpacity>
          </View>

          {/* Estadísticas */}
          <View className="flex-row justify-between">
            {userStats.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <View className="w-12 h-12 bg-card-bg border border-border-primary rounded-2xl items-center justify-center mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </View>
                <Text className="text-text-primary text-lg font-bold">{stat.value}</Text>
                <Text className="text-text-muted text-xs text-center">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navegación por pestañas */}
        <View className="bg-secondary-dark px-6 pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl border ${
                    activeTab === tab
                      ? 'bg-text-accent border-transparent'
                      : 'border-border-secondary bg-transparent'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    activeTab === tab ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="px-6">
          {/* Sección de Actividad Reciente */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-text-primary text-xl font-bold">Actividad Reciente</Text>
              <TouchableOpacity className="flex-row items-center space-x-1">
                <Edit3 className="w-4 h-4 text-text-accent" />
                <Text className="text-text-accent text-sm font-medium">Editar</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              {recentActivity.map((activity, index) => (
                <TouchableOpacity key={index} className="bg-card-bg border border-border-primary rounded-2xl p-4">
                  <View className="flex-row items-center space-x-3">
                    <View className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl items-center justify-center">
                      <Text className="text-xl">{activity.emoji}</Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-text-primary text-base font-semibold mb-1">{activity.title}</Text>
                      <Text className="text-text-secondary text-sm mb-1">{activity.action}</Text>
                      <Text className="text-text-muted text-xs">{activity.time}</Text>
                    </View>

                    <View className={`w-3 h-3 rounded-full ${getActivityTypeColor(activity.type)}`} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recomendación personalizada del perfil */}
          <View className="bg-card-bg bg-opacity-70 border border-border-accent rounded-3xl p-6 mb-8">
            <View className="flex-row items-center space-x-3 mb-4">
              <View className="w-8 h-8 bg-text-accent rounded-lg items-center justify-center">
                <Text className="text-text-primary text-sm font-semibold">AI</Text>
              </View>
              <Text className="text-text-primary text-base font-semibold">Insights de tu perfil</Text>
            </View>
            
            <Text className="text-text-secondary text-sm mb-4 leading-6">
              Te encantan las películas de ciencia ficción y thriller psicológico. Has visto más contenido los fines de semana.
            </Text>
            
            <View className="flex-row space-x-3">
              <View className="bg-accent-overlay border border-accent-border rounded-xl px-3 py-2 flex-1">
                <Text className="text-text-accent text-xs font-medium text-center">Género favorito: Sci-Fi</Text>
              </View>
              <View className="bg-accent-overlay border border-accent-border rounded-xl px-3 py-2 flex-1">
                <Text className="text-text-accent text-xs font-medium text-center">Día pico: Sábado</Text>
              </View>
            </View>
          </View>

          {/* Configuración y opciones */}
          <View className="mb-8">
            <Text className="text-text-primary text-xl font-bold mb-4">Configuración</Text>
            
            <View className="bg-card-bg border border-border-primary rounded-2xl overflow-hidden">
              {menuOptions.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  className={`flex-row items-center p-4 ${
                    index < menuOptions.length - 1 ? 'border-b border-border-primary' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-glass rounded-xl items-center justify-center mr-3">
                    <option.icon className="w-5 h-5 text-text-accent" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-semibold mb-1">{option.title}</Text>
                    <Text className="text-text-muted text-sm">{option.subtitle}</Text>
                  </View>

                  {option.hasArrow && (
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  )}
                  
                  {option.hasSwitch && (
                    <View className="w-12 h-6 bg-text-accent rounded-full justify-center">
                      <View className="w-5 h-5 bg-text-primary rounded-full self-end mr-0.5" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity className="bg-red-600 bg-opacity-10 border border-red-600 border-opacity-30 rounded-2xl p-4 mb-8 flex-row items-center justify-center space-x-2">
            <LogOut className="w-5 h-5 text-red-500" />
            <Text className="text-red-500 text-base font-semibold">Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Espacio adicional para navegación inferior */}
          <View className="h-24" />
        </View>
      </ScrollView>
    </View>
  );
};

export default Perfil;