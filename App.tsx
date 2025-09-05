// App.tsx
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import Header from "./src/home/components/Header"; // ajusta la ruta según tu proyecto

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* Header */}
      <Header />

      {/* Aquí ya no hay texto de ejemplo, solo el fondo */}
      <StatusBar style="light" />
    </View>
  );
}
