import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Logo profesional */}
      <View style={styles.logoContainer}>
        <View style={styles.squareContainer}>
          <View style={styles.circleContainer}>
            <Text style={styles.playIcon}>▷</Text>
          </View>
        </View>
        <Text style={styles.logoText}>Cine Estelar</Text>
        <Text style={styles.logoSubtitle}>Tu experiencia cinematográfica comienza aquí</Text>
      </View>

      {/* Correo */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Tu contraseña"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recordarme + Olvidaste */}
      <View style={styles.rowFlexible}>
        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          style={styles.rememberContainer}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <Text style={styles.checkboxText}>✔</Text>}
          </View>
          <Text style={styles.rememberText}>Recordarme</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Iniciar Sesión */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  squareContainer: {
    width: 100,
    height: 100,
    borderRadius: 20, // Esquinas redondeadas del cuadrado externo
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    width: 70,
    height: 70,
    borderRadius: 35, // Círculo interno
    backgroundColor: "#1D4ED8",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },
  logoSubtitle: {
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },

  inputWrapper: { marginBottom: 16 },
  label: { color: "#333", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  inputPassword: { flex: 1, fontSize: 16, paddingVertical: 10 },

  rowFlexible: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  rememberContainer: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#1D4ED8", borderColor: "#1D4ED8" },
  checkboxText: { color: "#fff", fontSize: 12 },
  rememberText: { color: "#333" },

  forgotContainer: { flexShrink: 1 },
  forgotText: { color: "#1D4ED8", fontWeight: "500", textAlign: "right" },

  button: { backgroundColor: "#1D4ED8", paddingVertical: 14, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
});
