import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/shared/contexts/AuthContext';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }

    const success = await register(email, password, nombre, apellido);
    if (success) {
      Alert.alert('Éxito', 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.');
    } else {
      Alert.alert('Error', 'No se pudo crear la cuenta. Verifica que el email no esté en uso.');
    }
  };

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
        <Text style={styles.logoSubtitle}>Únete a la mejor experiencia cinematográfica</Text>
      </View>

      {/* Nombre y Apellido */}
      <View style={styles.row}>
        <View style={[styles.inputWrapper, { marginRight: 8 }]}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        <View style={[styles.inputWrapper, { marginLeft: 8 }]}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            value={apellido}
            onChangeText={setApellido}
          />
        </View>
      </View>

      {/* Correo */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Teléfono */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Número de Teléfono</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          value={telefono}
          onChangeText={setTelefono}
        />
      </View>

      {/* Contraseña */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmar Contraseña */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Casilla de verificación */}
      <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)}>
        <View style={styles.termsContainer}>
          <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
            {acceptTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>
            Acepto los términos y condiciones y la política de privacidad de Cine Estelar.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón Crear Cuenta */}
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#9CA3AF' }]}
        onPress={handleRegister}
        disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  squareContainer: {
    width: 100,
    height: 100,
    borderRadius: 20, // Esquinas redondeadas del cuadrado externo
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 70,
    height: 70,
    borderRadius: 35, // Círculo interno
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  logoSubtitle: {
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  row: { flexDirection: 'row', marginBottom: 16 },
  inputWrapper: { marginBottom: 16, flex: 1 },
  label: { color: '#333', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
  },
  inputPassword: { flex: 1, fontSize: 16, paddingVertical: 10 },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  checkboxLabel: { flex: 1, color: '#333' },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});
