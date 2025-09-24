// Este es el código FINAL para tu archivo App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import './global.css';
import { Container } from '~/shared/components/Container';
import Navigation from '~/shared/components/Navigation';
import Home from '~/home/page/Home';
import Cines from '~/home/page/Cines';
import Entradas from '~/home/page/Entradas';
import Perfil from '~/home/page/Perfil';
import Cartelera from '~/cartelera/pages/Cartelera';
import Auth from '~/auth/pages/Auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

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

      {/* 1. La cabecera arriba */}
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
