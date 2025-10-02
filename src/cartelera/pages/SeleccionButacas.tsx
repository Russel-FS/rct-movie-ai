import { useMemo, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Fila, Asiento } from '~/shared/types/cinema';
import { RootStackParamList } from '~/shared/types/navigation';

type SeleccionButacasRouteProp = RouteProp<RootStackParamList, 'SeleccionButacas'>;
type SeleccionButacasNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionButacas'
>;

export default function SeleccionButacas() {
  const navigation = useNavigation<SeleccionButacasNavigationProp>();
  const route = useRoute<SeleccionButacasRouteProp>();
  const { peliculaId, cinemaName, fecha, hora, sala, formato, precio } = route.params;
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);

  const handleContinue = () => {
    if (asientosSeleccionados.length > 0) {
      navigation.navigate('SeleccionComidas', {
        peliculaId,
        cinemaName,
        fecha,
        hora,
        sala,
        formato,
        precio,
        asientosSeleccionados,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const filasData: Fila[] = [
    {
      letra: 'A',
      asientos: [
        { id: 'A1', numero: 1, ocupado: false, precio: precio },
        { id: 'A2', numero: 2, ocupado: false, precio: precio },
        { id: 'A3', numero: 3, ocupado: true, precio: precio },
        { id: 'A4', numero: 4, ocupado: false, precio: precio },
        { id: 'A5', numero: 5, ocupado: false, precio: precio },
        { id: 'A6', numero: 6, ocupado: false, precio: precio },
        { id: 'A7', numero: 7, ocupado: false, precio: precio },
        { id: 'A8', numero: 8, ocupado: false, precio: precio },
        { id: 'A9', numero: 9, ocupado: true, precio: precio },
        { id: 'A10', numero: 10, ocupado: false, precio: precio },
        { id: 'A11', numero: 11, ocupado: false, precio: precio },
        { id: 'A12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'B',
      asientos: [
        { id: 'B1', numero: 1, ocupado: false, precio: precio },
        { id: 'B2', numero: 2, ocupado: false, precio: precio },
        { id: 'B3', numero: 3, ocupado: false, precio: precio },
        { id: 'B4', numero: 4, ocupado: true, precio: precio },
        { id: 'B5', numero: 5, ocupado: false, precio: precio },
        { id: 'B6', numero: 6, ocupado: false, precio: precio },
        { id: 'B7', numero: 7, ocupado: false, precio: precio },
        { id: 'B8', numero: 8, ocupado: false, precio: precio },
        { id: 'B9', numero: 9, ocupado: false, precio: precio },
        { id: 'B10', numero: 10, ocupado: true, precio: precio },
        { id: 'B11', numero: 11, ocupado: false, precio: precio },
        { id: 'B12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'C',
      asientos: [
        { id: 'C1', numero: 1, ocupado: false, precio: precio },
        { id: 'C2', numero: 2, ocupado: false, precio: precio },
        { id: 'C3', numero: 3, ocupado: false, precio: precio },
        { id: 'C4', numero: 4, ocupado: false, precio: precio },
        { id: 'C5', numero: 5, ocupado: false, precio: precio },
        { id: 'C6', numero: 6, ocupado: true, precio: precio },
        { id: 'C7', numero: 7, ocupado: false, precio: precio },
        { id: 'C8', numero: 8, ocupado: false, precio: precio },
        { id: 'C9', numero: 9, ocupado: false, precio: precio },
        { id: 'C10', numero: 10, ocupado: false, precio: precio },
        { id: 'C11', numero: 11, ocupado: false, precio: precio },
        { id: 'C12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'D',
      asientos: [
        { id: 'D1', numero: 1, ocupado: false, precio: precio },
        { id: 'D2', numero: 2, ocupado: false, precio: precio },
        { id: 'D3', numero: 3, ocupado: false, precio: precio },
        { id: 'D4', numero: 4, ocupado: false, precio: precio },
        { id: 'D5', numero: 5, ocupado: false, precio: precio },
        { id: 'D6', numero: 6, ocupado: false, precio: precio },
        { id: 'D7', numero: 7, ocupado: true, precio: precio },
        { id: 'D8', numero: 8, ocupado: false, precio: precio },
        { id: 'D9', numero: 9, ocupado: false, precio: precio },
        { id: 'D10', numero: 10, ocupado: false, precio: precio },
        { id: 'D11', numero: 11, ocupado: false, precio: precio },
        { id: 'D12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'E',
      asientos: [
        { id: 'E1', numero: 1, ocupado: false, precio: precio },
        { id: 'E2', numero: 2, ocupado: false, precio: precio },
        { id: 'E3', numero: 3, ocupado: false, precio: precio },
        { id: 'E4', numero: 4, ocupado: false, precio: precio },
        { id: 'E5', numero: 5, ocupado: false, precio: precio },
        { id: 'E6', numero: 6, ocupado: false, precio: precio },
        { id: 'E7', numero: 7, ocupado: false, precio: precio },
        { id: 'E8', numero: 8, ocupado: true, precio: precio },
        { id: 'E9', numero: 9, ocupado: false, precio: precio },
        { id: 'E10', numero: 10, ocupado: false, precio: precio },
        { id: 'E11', numero: 11, ocupado: false, precio: precio },
        { id: 'E12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'F',
      asientos: [
        { id: 'F1', numero: 1, ocupado: false, precio: precio },
        { id: 'F2', numero: 2, ocupado: false, precio: precio },
        { id: 'F3', numero: 3, ocupado: false, precio: precio },
        { id: 'F4', numero: 4, ocupado: false, precio: precio },
        { id: 'F5', numero: 5, ocupado: false, precio: precio },
        { id: 'F6', numero: 6, ocupado: false, precio: precio },
        { id: 'F7', numero: 7, ocupado: false, precio: precio },
        { id: 'F8', numero: 8, ocupado: false, precio: precio },
        { id: 'F9', numero: 9, ocupado: true, precio: precio },
        { id: 'F10', numero: 10, ocupado: false, precio: precio },
        { id: 'F11', numero: 11, ocupado: false, precio: precio },
        { id: 'F12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'G',
      asientos: [
        { id: 'G1', numero: 1, ocupado: false, precio: precio },
        { id: 'G2', numero: 2, ocupado: false, precio: precio },
        { id: 'G3', numero: 3, ocupado: false, precio: precio },
        { id: 'G4', numero: 4, ocupado: false, precio: precio },
        { id: 'G5', numero: 5, ocupado: true, precio: precio },
        { id: 'G6', numero: 6, ocupado: false, precio: precio },
        { id: 'G7', numero: 7, ocupado: false, precio: precio },
        { id: 'G8', numero: 8, ocupado: false, precio: precio },
        { id: 'G9', numero: 9, ocupado: false, precio: precio },
        { id: 'G10', numero: 10, ocupado: false, precio: precio },
        { id: 'G11', numero: 11, ocupado: false, precio: precio },
        { id: 'G12', numero: 12, ocupado: false, precio: precio },
      ],
    },
    {
      letra: 'H',
      asientos: [
        { id: 'H1', numero: 1, ocupado: false, precio: precio },
        { id: 'H2', numero: 2, ocupado: false, precio: precio },
        { id: 'H3', numero: 3, ocupado: false, precio: precio },
        { id: 'H4', numero: 4, ocupado: false, precio: precio },
        { id: 'H5', numero: 5, ocupado: false, precio: precio },
        { id: 'H6', numero: 6, ocupado: true, precio: precio },
        { id: 'H7', numero: 7, ocupado: false, precio: precio },
        { id: 'H8', numero: 8, ocupado: false, precio: precio },
        { id: 'H9', numero: 9, ocupado: false, precio: precio },
        { id: 'H10', numero: 10, ocupado: false, precio: precio },
        { id: 'H11', numero: 11, ocupado: false, precio: precio },
        { id: 'H12', numero: 12, ocupado: false, precio: precio },
      ],
    },
  ];

  const asientosMap = useMemo(() => {
    const map = new Map<string, Asiento>();
    filasData.forEach((fila) => {
      fila.asientos.forEach((asiento) => {
        map.set(asiento.id, asiento);
      });
    });
    return map;
  }, []);

  const toggleAsiento = (asientoId: string) => {
    const asiento = asientosMap.get(asientoId);
    if (asiento?.ocupado) return;

    if (asientosSeleccionados.includes(asientoId)) {
      setAsientosSeleccionados((prev) => prev.filter((id) => id !== asientoId));
    } else {
      setAsientosSeleccionados((prev) => [...prev, asientoId]);
    }
  };

  const getAsientoEstado = (asiento: Asiento) => {
    if (asiento.ocupado) return 'ocupado';
    return asientosSeleccionados.includes(asiento.id) ? 'seleccionado' : 'disponible';
  };

  const calcularTotal = () => {
    let total = 0;
    for (const asientoId of asientosSeleccionados) {
      const asiento = asientosMap.get(asientoId);
      if (asiento) {
        total += asiento.precio;
      }
    }
    return total;
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
  };

  const renderAsiento = (asiento: Asiento) => {
    const estado = getAsientoEstado(asiento);

    return (
      <TouchableOpacity
        key={asiento.id}
        onPress={() => toggleAsiento(asiento.id)}
        disabled={estado === 'ocupado'}
        activeOpacity={0.7}
        style={{
          width: 28,
          height: 28,
          margin: 3,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            estado === 'disponible' ? '#1c1c1e' : estado === 'seleccionado' ? '#007AFF' : '#2c2c2e',
          borderWidth: estado === 'disponible' ? 1 : 0,
          borderColor: '#3a3a3c',
          opacity: estado === 'ocupado' ? 0.4 : 1,
          shadowColor: estado === 'seleccionado' ? '#007AFF' : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: estado === 'seleccionado' ? 6 : 0,
        }}>
        {estado === 'seleccionado' && (
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'white',
              shadowColor: 'white',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          />
        )}
        {estado === 'ocupado' && (
          <View
            style={{
              width: 14,
              height: 2,
              backgroundColor: '#8e8e93',
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderFila = (fila: Fila) => {
    return (
      <View
        key={fila.letra}
        style={{
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 4,
        }}>
        <Text
          style={{
            width: 28,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: '600',
            color: '#8e8e93',
            letterSpacing: 0.5,
          }}>
          {fila.letra}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              paddingRight: 8,
            }}>
            {fila.asientos.slice(0, 6).map(renderAsiento)}
          </View>
          <View style={{ width: 24 }} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              paddingLeft: 8,
            }}>
            {fila.asientos.slice(6, 12).map(renderAsiento)}
          </View>
        </View>
        <View style={{ width: 28 }} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header con botón de regreso */}
        <View style={{ paddingHorizontal: 28, paddingTop: 48, paddingBottom: 24 }}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#1c1c1e',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
            activeOpacity={0.7}>
            <Text style={{ color: '#fff', fontSize: 24 }}>{'‹'}</Text>
          </TouchableOpacity>

          {/* Información de la función */}
          <View
            style={{
              backgroundColor: '#1c1c1e',
              borderRadius: 18,
              padding: 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#2c2c2e',
            }}>
            <Text style={{ fontSize: 14, color: '#8e8e93', marginBottom: 8 }}>{cinemaName}</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 12 }}>
              {sala} • {formato}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 12, color: '#8e8e93', marginBottom: 4 }}>Fecha</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
                  {formatFecha(fecha)}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#8e8e93', marginBottom: 4 }}>Hora</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>{hora}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#8e8e93', marginBottom: 4 }}>Precio</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
                  S/ {(precio || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Barra de progreso */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#10B981',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
              </View>
              <Text style={{ color: '#10B981', fontSize: 10, marginLeft: 6, fontWeight: '600' }}>
                Lugar
              </Text>
            </View>
            <View
              style={{ flex: 1, height: 1.5, backgroundColor: '#10B981', marginHorizontal: 8 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#10B981',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
              </View>
              <Text style={{ color: '#10B981', fontSize: 10, marginLeft: 6, fontWeight: '600' }}>
                Horario
              </Text>
            </View>
            <View
              style={{ flex: 1, height: 1.5, backgroundColor: '#007AFF', marginHorizontal: 8 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#007AFF',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>3</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 10, marginLeft: 6, fontWeight: '600' }}>
                Asientos
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 34,
              fontWeight: '700',
              color: '#fff',
              marginBottom: 8,
              letterSpacing: -1,
            }}>
            Selecciona
          </Text>
          <Text
            style={{
              fontSize: 34,
              fontWeight: '300',
              color: '#fff',
              marginBottom: 12,
              letterSpacing: -1,
            }}>
            tus asientos
          </Text>
          <Text style={{ fontSize: 17, color: '#8e8e93', lineHeight: 22 }}>
            Elige la experiencia perfecta
          </Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <View
            style={{
              width: 320,
              height: 6,
              backgroundColor: '#1c1c1e',
              borderRadius: 3,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#636366',
              letterSpacing: 3,
            }}>
            PANTALLA
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 32,
            backgroundColor: '#1c1c1e',
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: '#2c2c2e',
          }}>
          {filasData.map(renderFila)}
        </View>

        <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
          <View
            style={{
              backgroundColor: '#1c1c1e',
              borderRadius: 18,
              padding: 20,
              borderWidth: 1,
              borderColor: '#2c2c2e',
            }}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#1c1c1e',
                    borderWidth: 1,
                    borderColor: '#3a3a3c',
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '500' }}>Disponible</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#007AFF',
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#007AFF',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  }}>
                  <View
                    style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'white' }}
                  />
                </View>
                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '500' }}>Seleccionado</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#2c2c2e',
                    marginRight: 10,
                    opacity: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 1.5,
                      backgroundColor: '#8e8e93',
                      borderRadius: 1,
                      transform: [{ rotate: '45deg' }],
                    }}
                  />
                </View>
                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '500' }}>Ocupado</Text>
              </View>
            </View>
          </View>
        </View>

        {asientosSeleccionados.length > 0 && (
          <View style={{ marginHorizontal: 28, marginBottom: 40 }}>
            <View
              style={{
                backgroundColor: '#007AFF',
                borderRadius: 20,
                padding: 28,
                shadowColor: '#007AFF',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 24,
                }}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 22,
                      fontWeight: '700',
                      marginBottom: 8,
                      letterSpacing: -0.5,
                    }}>
                    {asientosSeleccionados.length} asiento
                    {asientosSeleccionados.length > 1 ? 's' : ''}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 16,
                        fontWeight: '500',
                        lineHeight: 20,
                      }}
                      numberOfLines={3}>
                      {asientosSeleccionados.join(' • ')}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', minWidth: 120 }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 28,
                      fontWeight: '300',
                      letterSpacing: -1,
                    }}>
                    S/ {calcularTotal().toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 14,
                      fontWeight: '500',
                      marginTop: 2,
                    }}>
                    Total
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  paddingVertical: 18,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                onPress={handleContinue}
                activeOpacity={0.8}>
                <Text
                  style={{
                    color: '#007AFF',
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '600',
                    letterSpacing: -0.3,
                  }}>
                  Continuar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 28, paddingBottom: 48 }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: '#8e8e93',
              lineHeight: 24,
              fontWeight: '400',
            }}>
            Las filas centrales ofrecen la mejor experiencia.{'\n'}
            Toca para seleccionar tus asientos favoritos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
