import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
// Asegúrate de que la ruta de importación sea correcta para tu proyecto
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

// Puedes usar cualquier set de íconos, MaterialCommunityIcons es muy completo.

const Entrada = () => {
  // --- DATOS ESTÁTICOS ---
  // Luego podrás recibir estos datos como props
  const ticketData = {
    orderId: '3083F667',
    confirmationCode: 'WGGG2XX',
    cinema: 'CINEMARK MEGAPLAZA CALLE ALFREDO MENDIOLA 3698 KM 8.5 DE LA AV. PANAMERICANA NORTE INDEPENDENCIA',
    movie: 'COMO ENTRENAR A TU DRAGON (DOB 2D)',
    date: 'MARTES 24 JUNIO 2025 07:50PM',
    room: '11',
    seats: 'D-20',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.ticketCard}>
        {/* --- CABECERA DE LA ORDEN --- */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            ORDEN <Text style={styles.orderId}>#{ticketData.orderId}</Text>
          </Text>
        </View>

        {/* --- CUERPO PRINCIPAL (QR Y RECOMENDACIONES) --- */}
        <View style={styles.body}>
          <View style={styles.qrSection}>
            <Text style={styles.status}>COMPLETADA</Text>
            {/* Asegúrate de que la ruta a tu imagen sea correcta */}
            <Image
              source={require('../assets/images/qr-code.png')}
              style={styles.qrImage}
            />
            <Text style={styles.confirmationCode}>Código de confirmación</Text>
            <Text style={styles.confirmationCodeValue}>{ticketData.confirmationCode}</Text>
          </View>

          <View style={styles.recommendationsSection}>
            <Text style={styles.recommendationsTitle}>
              RECOMENDACIONES PARA UNA EXPERIENCIA SEGURA:
            </Text>
            <Text style={styles.recommendationItem}>
              • Respeta tu ubicación en la sala y mantén la sana distancia.
            </Text>
            <Text style={styles.recommendationItem}>
              • Higieniza tus manos constantemente con el alcohol en gel.
            </Text>
            <Text style={styles.recommendationItem}>
              • Sigue las indicaciones de salida de la sala de manera ordenada.
            </Text>
          </View>
        </View>

        {/* --- SEPARADOR --- */}
        <View style={styles.separator} />

        {/* --- DETALLES DE LA ENTRADA --- */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="map-marker-outline" size={20} color="#9ca3af" style={{marginRight: 4}} />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>TEATRO: </Text>{ticketData.cinema}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="movie-open-outline" size={20} color="#9ca3af" style={{marginRight: 4}} />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>PELÍCULA: </Text>{ticketData.movie}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar-month-outline" size={20} color="#9ca3af" style={{marginRight: 4}} />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>FECHA: </Text>{ticketData.date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="door-closed" size={20} color="#9ca3af" style={{marginRight: 4}} />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>SALA: </Text>{ticketData.room}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="seat-outline" size={20} color="#9ca3af" style={{marginRight: 4}} />
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>ASIENTOS: </Text>{ticketData.seats}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// --- HOJA DE ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12151e', // Fondo oscuro principal de la app
  },
  contentContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#1f2937', // Fondo de la tarjeta
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  orderId: {
    color: '#f59e0b', // Color de acento
  },
  body: {
    // En React Native, la dirección por defecto es 'column'
    // Los elementos se apilarán verticalmente, lo que es bueno para móviles.
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  status: {
    color: '#10b981', // Verde
    fontWeight: '500',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  confirmationCode: {
    color: '#d1d5db',
    fontSize: 14,
  },
  confirmationCodeValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  recommendationsSection: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  recommendationsTitle: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  recommendationItem: {
    color: '#d1d5db',
    fontSize: 13,
    marginBottom: 5,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 16,
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailText: {
    color: '#d1d5db',
    fontSize: 14,
    marginLeft: 12,
    flex: 1, // Para que el texto se ajuste si es muy largo
    lineHeight: 20,
  },
  detailLabel: {
    color: '#f0f0f0',
    fontWeight: '700',
  },
});

export default Entrada;