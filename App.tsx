import { ScreenContent } from 'src/shared/components/ScreeenContent';
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
  },
});

