import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Film, ChevronRight, Tag } from 'lucide-react-native';

import './global.css';
import { Container } from '~/shared/components/Container';
import Navigation from '~/shared/components/Navigation';
import Home from '~/home/page/Home';
import Cines from '~/home/page/Cines';
import Entradas from '~/home/page/Entradas';
import Perfil from '~/home/page/Perfil';

// ⚠️ Importación temporal para el crud de películas
import Peliculas from '~/home/admin/PeliculasCRUD';
import Genero from '~/home/admin/GeneroCRUD';

import Cartelera from '~/cartelera/pages/Cartelera';
import Auth from '~/auth/pages/Auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // ⚠️ Estado temporal para manejar vista interna en "peliculas"
  const [vista, setVista] = useState<'menu' | 'peliculas' | 'generos'>('menu');

  // 🔄 Resetear vista cada vez que se entra en el tab "peliculas"
  useEffect(() => {
    if (activeTab === 'Admin') {
      setVista('menu');
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (vista) {
      case 'peliculas':
        return (
          <View className="flex-1 bg-black">
            <Peliculas />
          </View>
        );
      case 'generos':
        return (
          <View className="flex-1 bg-black">
            <Genero />
          </View>
        );
      default:
        return (
          <View className="flex-1 bg-black">
            {/* Header */}
            <View className="px-4 pb-4 pt-14">
              <Text className="mb-1 text-sm text-gray-400">Administración</Text>
              <Text className="mb-4 text-2xl font-bold text-white">Gestión de Contenido</Text>
              <Text className="text-sm text-gray-300">
                Selecciona qué tipo de contenido deseas administrar
              </Text>
            </View>

            {/* Botones de navegación */}
            <View className="flex-1 px-4">
              <View className="space-y-4">
                {/* Botón Gestión de Películas */}
                <TouchableOpacity
                  onPress={() => setVista('peliculas')}
                  className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg"
                >
                  <View className="flex-row items-center">
                    <View className="mr-4 rounded-full bg-white/20 p-3">
                      <Film size={32} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-xl font-bold text-white">
                        Gestión de Películas
                      </Text>
                      <Text className="text-sm text-blue-100">
                        Administra el catálogo de películas, clasificaciones y más
                      </Text>
                    </View>
                    <ChevronRight size={24} color="#ffffff" />
                  </View>
                </TouchableOpacity>

                {/* Botón Gestión de Géneros */}
                <TouchableOpacity
                  onPress={() => setVista('generos')}
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 shadow-lg"
                >
                  <View className="flex-row items-center">
                    <View className="mr-4 rounded-full bg-white/20 p-3">
                      <Tag size={32} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 text-xl font-bold text-white">
                        Gestión de Géneros
                      </Text>
                      <Text className="text-sm text-purple-100">
                        Administra las categorías y géneros cinematográficos
                      </Text>
                    </View>
                    <ChevronRight size={24} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  const getActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'cartelera':
        return <Cartelera />;
      case 'Cines':
        return <Cines />;
      case 'entries':
        return <Entradas />;
      case 'auth':
        return <Auth />;
      case 'profile':
        return <Perfil />;
      case 'Admin':
        return renderContent();
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Container>
        {getActiveComponent()}
        <Navigation onTabChange={setActiveTab} initialTab={activeTab} />
      </Container>
      <StatusBar style="auto" />
    </>
  );
}

// Estos son los estilos que hacen la magia del layout
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: '#fff',
  },
  content: {
    flex: 1, // Se estira y empuja el footer hacia abajo
  },
});
