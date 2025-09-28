// src/pages/SeleccionHorario.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";

export default function SeleccionHorario() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Seleccionar Horario</Text>
      <Text style={styles.subHeader}>Dune: Parte Dos • Ciencia Ficción</Text>

      {/* Movie Card */}
      <Card style={styles.movieCard}>
        <Card.Content>
          <Text style={styles.movieTitle}>Dune: Parte Dos</Text>
          <Text style={styles.movieInfo}>Ciencia Ficción • 2h 46m</Text>
          <Text style={styles.rating}>⭐ 8.5</Text>
        </Card.Content>
      </Card>

      {/* Cine */}
      <Card style={styles.cineCard}>
        <Card.Content>
          <Text style={styles.cineTitle}>Cinépolis Plaza Norte</Text>
          <Text style={styles.cineInfo}>2.3 km de tu ubicación</Text>
        </Card.Content>
      </Card>

      {/* Seleccionar fecha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona Fecha</Text>
        <Button mode="contained" style={styles.dateButton}>
          Hoy {"\n"}14 Mar Jueves
        </Button>
      </View>

      {/* Horarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horarios Disponibles</Text>

        <Card style={styles.horarioCard}>
          <Card.Content style={styles.horarioContent}>
            <Text style={styles.horarioHora}>14:30</Text>
            <Text style={styles.horarioInfo}>Sala 1 • 2D</Text>
            <Text style={styles.precio}>$12.50</Text>
          </Card.Content>
        </Card>

        <Card style={styles.horarioCard}>
          <Card.Content style={styles.horarioContent}>
            <Text style={styles.horarioHora}>17:00</Text>
            <Text style={styles.horarioInfo}>Sala 2 • 2D</Text>
            <Text style={styles.precio}>$12.50</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Pasos para la compra */}
      <View style={styles.pasosContainer}>
        <Button mode="contained" style={styles.pasoBtn}>
          Paso 1: Seleccionar Función
        </Button>
        <Button mode="contained" style={styles.pasoBtn}>
          Paso 2: Elegir Asientos
        </Button>
        <Button mode="contained" style={styles.pasoBtn}>
          Paso 3: Realizar Pago
        </Button>
      </View>

      {/* Nueva barra de pasos */}
      <View style={styles.nuevaPasosBar}>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>📍</Text>
          <Text style={styles.pasoTexto}>Selección de lugar</Text>
        </Button>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>🕑</Text>
          <Text style={styles.pasoTexto}>Selección horario</Text>
        </Button>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>🪑</Text>
          <Text style={styles.pasoTexto}>Selección de butacas</Text>
        </Button>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>🍔</Text>
          <Text style={styles.pasoTexto}>Selección de comidas</Text>
        </Button>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>💳</Text>
          <Text style={styles.pasoTexto}>Método pago</Text>
        </Button>
        <Button mode="text" style={styles.nuevaPasoBtn}>
          <Text style={styles.iconoPaso}>💵</Text>
          <Text style={styles.pasoTexto}>Resumen</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", // fondo oscuro
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  subHeader: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  movieCard: {
    backgroundColor: "#1c1c1c",
    marginBottom: 16,
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  movieInfo: {
    fontSize: 14,
    color: "#bbb",
    marginVertical: 4,
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
    fontWeight: "bold",
  },
  cineCard: {
    backgroundColor: "#1c1c1c",
    marginBottom: 20,
    borderRadius: 10,
  },
  cineTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cineInfo: {
    fontSize: 13,
    color: "#aaa",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  horarioCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    marginBottom: 10,
  },
  horarioContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horarioHora: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  horarioInfo: {
    fontSize: 14,
    color: "#aaa",
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  pasosContainer: {
    display: "flex",
    gap: 32,
    justifyContent: "center",
    marginVertical: 32,
  },
  pasoBtn: {
    backgroundColor: "#3a4351",
    color: "#fff",
    borderRadius: 999,
    paddingHorizontal: 32,
    height: 48,
    minWidth: 220,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 16,
    fontWeight: "500",
    // The following properties are not supported in React Native and should be removed or replaced:
    // cursor: "pointer",
    // transition: "background 0.2s",
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  "pasoBtn.active": {
    backgroundColor: "#2563eb",
    color: "#fff",
  },
  nuevaPasosBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  nuevaPasoBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "transparent",
  },
  iconoPaso: {
    fontSize: 18,
    color: "#007bff",
    marginRight: 8,
  },
  pasoTexto: {
    fontSize: 14,
    color: "#fff",
  },
});
