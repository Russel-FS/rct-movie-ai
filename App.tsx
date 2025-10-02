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

// import Cartelera from '~/cartelera/pages/Cartelera';
import Auth from '~/auth/pages/Auth';
import SeleccionLugar from '~/cartelera/pages/SeleccionLugar';
import SeleccionHorario from '~/cartelera/pages/SeleccionHorario';
import SeleccionButacas from '~/cartelera/pages/SeleccionButacas';
import SeleccionComidas from '~/cartelera/pages/SeleccionComidas';

// Tipo para la información de selección
interface SeleccionInfo {
  peliculaId: string;
  cinemaId?: number;
  cinemaName?: string;
  horario?: string;
  fecha?: string;
  funcionId?: number;
  sala?: string;
  formato?: string;
  precio?: number;
  asientosSeleccionados?: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [vista, setVista] = useState<'menu' | 'peliculas' | 'generos'>('menu');
  const [seleccionInfo, setSeleccionInfo] = useState<SeleccionInfo | null>(null);

  // 🔄 Resetear vista cada vez que se entra en el tab "peliculas"
  useEffect(() => {
    if (activeTab === 'Admin') {
      setVista('menu');
    }
  }, [activeTab]);

  // 🎬 Manejar la selección de película
  const handleMoviePress = (peliculaId: string) => {
    setSeleccionInfo({ peliculaId });
    setActiveTab('seleccionLugar');
  };

  // ✅ Manejar la selección de cine desde SeleccionLugar
  const handleLugarSelected = (cinemaId: number, cinemaName: string) => {
    if (seleccionInfo) {
      setSeleccionInfo({
        ...seleccionInfo,
        cinemaId,
        cinemaName
      });
      setActiveTab('seleccionHorario');
    }
  };

  // ✅ Manejar la selección de función desde SeleccionHorario
  const handleHorarioSelected = (funcionId: number, fecha: string, sala: string, formato: string, precio: number) => {
    if (seleccionInfo) {
      setSeleccionInfo({
        ...seleccionInfo,
        funcionId,
        fecha,
        sala,
        formato,
        precio
      });
      setActiveTab('seleccionButacas');
    }
  };

  // ✅ Manejar la selección de asientos desde SeleccionButacas
  const handleButacasSelected = (asientos: string[]) => {
    if (seleccionInfo) {
      setSeleccionInfo({
        ...seleccionInfo,
        asientosSeleccionados: asientos
      });
      setActiveTab('seleccionComidas');
    }
  };

  // 🔙 Manejar el regreso desde SeleccionLugar
  const handleBackFromSeleccion = () => {
    setSeleccionInfo(null);
    setActiveTab('home');
  };

  // 🔙 Manejar el regreso desde SeleccionHorario
  const handleBackFromHorario = () => {
    setActiveTab('seleccionLugar');
  };

  // 🔙 Manejar el regreso desde SeleccionButacas
  const handleBackFromButacas = () => {
    setActiveTab('seleccionHorario');
  };

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
        return <Home onMoviePress={handleMoviePress} />;
      case 'cartelera':
        return /*<Cartelera />;*/
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
      case 'seleccionLugar':
        return seleccionInfo ? (
          <SeleccionLugar 
            peliculaId={seleccionInfo.peliculaId} 
            onBack={handleBackFromSeleccion}
            onContinue={handleLugarSelected}
          />
        ) : (
          <Home onMoviePress={handleMoviePress} />
        );
      case 'seleccionHorario':
        return seleccionInfo && seleccionInfo.cinemaId ? (
          <SeleccionHorario 
            peliculaId={seleccionInfo.peliculaId}
            cinemaId={seleccionInfo.cinemaId}
            cinemaName={seleccionInfo.cinemaName || ''}
            horario={seleccionInfo.horario || ''}
            onBack={handleBackFromHorario}
            onContinue={handleHorarioSelected}
          />
        ) : (
          <Home onMoviePress={handleMoviePress} />
        );
      case 'seleccionButacas':
        return seleccionInfo && seleccionInfo.funcionId ? (
          <SeleccionButacas 
            peliculaId={seleccionInfo.peliculaId}
            cinemaName={seleccionInfo.cinemaName || ''}
            fecha={seleccionInfo.fecha || ''}
            hora={seleccionInfo.horario || ''}
            sala={seleccionInfo.sala || ''}
            formato={seleccionInfo.formato || ''}
            precio={seleccionInfo.precio || 0}
            onBack={handleBackFromButacas}
            onContinue={handleButacasSelected}
          />
        ) : (
          <Home onMoviePress={handleMoviePress} />
        );
      case 'seleccionComidas':
        return seleccionInfo && seleccionInfo.asientosSeleccionados ? (
          <SeleccionComidas 
            peliculaId={seleccionInfo.peliculaId}
            cinemaName={seleccionInfo.cinemaName || ''}
            fecha={seleccionInfo.fecha || ''}
            hora={seleccionInfo.horario || ''}
            sala={seleccionInfo.sala || ''}
            formato={seleccionInfo.formato || ''}
            precio={seleccionInfo.precio || 0}
            asientosSeleccionados={seleccionInfo.asientosSeleccionados}
            onBack={() => setActiveTab('seleccionButacas')}
          />
        ) : (
          <Home onMoviePress={handleMoviePress} />
        );
      default:
        return <Home onMoviePress={handleMoviePress} />;
    }
  };

  return (
    <>
      <Container>
        {getActiveComponent()}
        {/* Solo mostrar Navigation si no estamos en las pantallas de selección */}
        {activeTab !== 'seleccionLugar' && 
         activeTab !== 'seleccionHorario' && 
         activeTab !== 'seleccionButacas' && 
         activeTab !== 'seleccionComidas' && (
          <Navigation onTabChange={setActiveTab} initialTab={activeTab} />
        )}
      </Container>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});