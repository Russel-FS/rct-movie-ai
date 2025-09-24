import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Cartelera");
  const [search, setSearch] = useState("");

  const menuItems = [
    "Cartelera",
    "Entradas",
    "Confitería",
    "Descuentos",
    "Suscripciones",
    "Perfil",
  ];

  return (
    <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
      {/* === Fila superior === */}
      <View style={styles.topRow}>
        {/* Logo */}
        <Text style={styles.logo}>🎬 MovieAI</Text>

        {/* Buscador */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar películas, combos o promociones"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          <TouchableOpacity>
            <Ionicons name="search" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Usuario */}
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={34} color="white" />
        </TouchableOpacity>
      </View>

      {/* === Fila inferior: menú === */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.menu}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveTab(item)}
            style={[
              styles.menuItem,
              activeTab === item && styles.activeMenuItem,
            ]}
          >
            <Text
              style={[
                styles.menuText,
                activeTab === item && styles.activeMenuText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  menuItem: {
    marginRight: 20,
    paddingBottom: 4,
  },
  activeMenuItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#facc15",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  activeMenuText: {
    color: "#facc15",
  },
});
