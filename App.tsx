import { ScreenContent } from 'src/shared/components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { Footer } from './src/home/components/Footer';

import './global.css';

// Marcadores de posición para los otros componentes
const Header = () => (
  <View style={styles.header}>
    <Text style={styles.placeholderText}>Header</Text>
  </View>
);
const Hero = () => (
  <View style={styles.hero}>
    <Text style={styles.placeholderText}>Hero Section</Text>
  </View>
);

export default function App() {
  return (
    <>
      <ScreenContent title="Home" path="App.tsx">
        <Header />
        <Hero />
      </ScreenContent>
      <Footer />
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
