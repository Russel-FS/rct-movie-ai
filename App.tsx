// Este es el código FINAL para tu archivo App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// --- IMPORTAMOS LAS 3 PARTES DE LA PANTALLA ---
// ¡Ojo! Las rutas ahora son correctas según tu última imagen.
import Header from './src/home/components/Header';
import Main from './src/home/components/Main';
import Footer from './src/home/components/Footer';

// Este archivo es para los estilos de Tailwind/Nativewind, lo dejamos.
import './global.css';


export default function App() {
  return (
    // SafeAreaView es el contenedor principal
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* 1. La cabecera arriba */}
      <Header />

      {/* 2. El contenido principal que se estira para ocupar el espacio */}
      <View style={styles.content}>
        <Main />
      </View>

      {/* 3. El pie de página abajo */}
      <Footer />
      
    </SafeAreaView>
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