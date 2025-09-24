// Este es el código FINAL para tu archivo App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import SeleccionLugar from 'src/cartelera/pages/SeleccionLugar'; // Importa el componente

import './global.css';

export default function App() {
  const scale = useSharedValue(1);
  const router = useRouter();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startAnimation = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  };

  //tuve que agregar aqui para verl desde web pq en cel no me carga nose pq, estuve tratando como loco para que cargara
  return (
    <>
      {/* Muestra directamente el diseño de SeleccionLugar */}
      <SeleccionLugar />
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
