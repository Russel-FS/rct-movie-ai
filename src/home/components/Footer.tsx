import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Copyright } from 'lucide-react-native';

export function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Logo de la Empresa</Text>
        <Text style={styles.text}>Movie AI</Text>

        <Image source={require('assets/logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Dirección</Text>
        <Text style={styles.text}>Avenida Abancay, Lima</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Políticas</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://i.pinimg.com/736x/ff/e6/b0/ffe6b01a4efb9a0822c11b0a38bc2b90.jpg')}>
          <Text style={styles.link}>Políticas de Privacidad</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://i.pinimg.com/736x/ff/e6/b0/ffe6b01a4efb9a0822c11b0a38bc2b90.jpg')}>
          <Text style={styles.link}>Términos de Servicio</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.copySection}>
        <Copyright color="gray" size={16} />
        <Text style={styles.copyText}> 2025 Movie AI. Todos los derechos reservados.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  section: {
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    color: '#E5E5EA',
  },
  link: {
    color: '#0A84FF',
    textDecorationLine: 'underline',
  },
  copySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  copyText: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 5,
  },
  logo: {
   width: 100,
  height: 100,
  resizeMode: 'contain',
  borderRadius: 50, 
  borderWidth: 2,  
  borderColor: 'red',
  marginVertical: 10,
  },
});
