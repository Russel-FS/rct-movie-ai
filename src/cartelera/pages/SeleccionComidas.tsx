import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/types/navigation';
import { ChevronLeft, MapPin, Clock, Calendar } from 'lucide-react-native';

type Producto = {
  name: string;
  description: string;
  price: number;
  type: string;
  image: any;
  cantidad?: number;
};

type SeleccionComidasRouteProp = RouteProp<RootStackParamList, 'SeleccionComidas'>;
type SeleccionComidasNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionComidas'
>;

export default function SeleccionComidas() {
  const navigation = useNavigation<SeleccionComidasNavigationProp>();
  const route = useRoute<SeleccionComidasRouteProp>();
  const { peliculaId, cinemaName, fecha, hora, sala, formato, precio, asientosSeleccionados } =
    route.params;
  const { width, height } = Dimensions.get('window');
  const tGrande = width * 0.07;
  const tMedio = width * 0.045;
  const tPeque = width * 0.035;

  const handleContinue = (comidas: Producto[], subtotalComidas: number) => {
    const subtotalEntradas = precio * asientosSeleccionados.length;
    const totalPagar = subtotalEntradas + subtotalComidas;

    navigation.navigate('MetodoPago', {
      peliculaId,
      cinemaName,
      fecha,
      hora,
      sala,
      formato,
      asientosSeleccionados,
      comidas: comidas.map((c, index) => ({
        id: index + 1,
        nombre: c.name,
        cantidad: c.cantidad || 1,
        precio: c.price,
      })),
      subtotalEntradas,
      subtotalComidas,
      totalPagar,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const productos: Record<string, Producto[]> = {
    Combos: [
      {
        name: 'Combo Trio Estelar',
        description: '3 Canchitas medianas + 3 Bebidas grandes',
        price: 85.9,
        type: 'COMBO',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca61/common/529-1754336185869',
        },
      },
      {
        name: 'Combo Duo Estelar',
        description: '2 Canchitas + 2 Bebidas grandes',
        price: 47.3,
        type: 'COMBO',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca61/common/529-1754336185869',
        },
      },
      {
        name: 'Combinación 1 Estelar',
        description: '1 Canchita + 1 Bebida',
        price: 22.2,
        type: 'COMBO',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca64/common/530-1754336201782',
        },
      },
      {
        name: 'Mega Combinación Estelar',
        description: '1 Canchita + 1 Bebida grande',
        price: 22.9,
        type: 'COMBO',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca67/common/531-1754336216332',
        },
      },
    ],
    Canchita: [
      {
        name: 'Canchita Mediana',
        description: 'Clásica con mantequilla',
        price: 15.0,
        type: 'CANCHITA',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca76/common/535-1754336275727',
        },
      },
      {
        name: 'Canchita Grande',
        description: 'Ideal para compartir',
        price: 20.0,
        type: 'CANCHITA',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca79/common/1094-1754336288561',
        },
      },
    ],
    Bebidas: [
      {
        name: 'Gaseosa Grande',
        description: 'Tamaño grande, refrescante',
        price: 12.0,
        type: 'BEBIDA',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca7f/common/1095-1752610498463',
        },
      },
      {
        name: 'Gaseosa Mediana',
        description: 'Tamaño mediano',
        price: 9.0,
        type: 'BEBIDA',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca7c/common/537-1752610612431',
        },
      },
      {
        name: 'Agua sin Gas',
        description: 'Botella de agua sin gas',
        price: 7.0,
        type: 'BEBIDA',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca82/common/538-1752610632804',
        },
      },
    ],
    Snacks: [
      {
        name: 'Hot Dog Frankfurter',
        description: 'Pan, salchicha, mostaza y ketchup',
        price: 16.0,
        type: 'SNACK',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca88/common/534-1756913017116',
        },
      },
      {
        name: 'Nachos con Queso',
        description: 'Nachos crujientes con queso cheddar',
        price: 18.0,
        type: 'SNACK',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/653aa79e5aa07300084dca91/common/536-1756912982119',
        },
      },
    ],
    Dulces: [
      {
        name: "M&M's",
        description: 'Bolsa 150g',
        price: 12.0,
        type: 'DULCE',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/67925fc2890878ee2b0e6386/common/1100-1752618390328',
        },
      },
      {
        name: 'Skittles',
        description: 'Bolsa 120g',
        price: 11.0,
        type: 'DULCE',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/67925fc2890878ee2b0e6386/common/1100-1752618390328',
        },
      },
    ],
    Coleccionables: [
      {
        name: 'Combo Duo Superman',
        description: 'Combo edición especial Superman',
        price: 49.9,
        type: 'COLECCIONABLE',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/687ff623be197a99a4397654/common/15325-1754592931469',
        },
      },
      {
        name: 'Combo Vaso 4 Fantástico',
        description: 'Incluye vaso edición especial',
        price: 39.9,
        type: 'COLECCIONABLE',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/6883c5aeebe651c5cb3c42cb/common/15374-1754592910175',
        },
      },
      {
        name: 'Combo Duo Cabeza Pitufo',
        description: 'Combo edición Pitufo',
        price: 44.9,
        type: 'COLECCIONABLE',
        image: {
          uri: 'https://assets.cinemark-core.com/6183fbcacbb5c4a4c7d8d950/vista/concessions/687ff623be197a99a4397660/common/15327-1754592965166',
        },
      },
    ],
  };

  const categorias = Object.keys(productos);
  const [catActiva, setCatActiva] = useState('Combos');
  const [carrito, setCarrito] = useState<Producto[]>([]);

  const agregarCarrito = (producto: Producto) => {
    const productoExistente = carrito.find((p) => p.name === producto.name);
    if (productoExistente) {
      setCarrito(
        carrito.map((p) =>
          p.name === producto.name ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (nombreProducto: string) => {
    const producto = carrito.find((p) => p.name === nombreProducto);
    if (producto && (producto.cantidad || 1) > 1) {
      setCarrito(
        carrito.map((p) =>
          p.name === nombreProducto ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p
        )
      );
    } else {
      setCarrito(carrito.filter((p) => p.name !== nombreProducto));
    }
  };

  const calcularTotalCarrito = () => {
    return carrito.reduce((total, p) => total + (p.price || 0) * (p.cantidad || 1), 0);
  };

  const calcularTotalEntradas = () => {
    return (precio || 0) * (asientosSeleccionados?.length || 0);
  };

  const calcularTotalGeneral = () => {
    const totalEntradas = calcularTotalEntradas() || 0;
    const totalCarrito = calcularTotalCarrito() || 0;
    return totalEntradas + totalCarrito;
  };

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header con botón de regreso */}
        <View style={{ paddingHorizontal: 28, paddingTop: 48, paddingBottom: 16 }}>
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

          {/* Resumen de la compra */}
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 12, color: '#8e8e93', marginBottom: 4 }}>
                  Fecha y hora
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
                  {formatFecha(fecha)} • {hora}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 12, color: '#8e8e93', marginBottom: 4 }}>Asientos</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
                  {asientosSeleccionados.join(', ')}
                </Text>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: '#2c2c2e', paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#8e8e93' }}>
                  Entradas ({asientosSeleccionados.length})
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                  S/ {calcularTotalEntradas().toFixed(2)}
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
                Asientos
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
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>4</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 10, marginLeft: 6, fontWeight: '600' }}>
                Dulcería
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
            Dulcería
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: '#8e8e93',
              marginBottom: 16,
              lineHeight: 22,
            }}>
            Completa tu experiencia con algo delicioso
          </Text>
        </View>

        {/* Categorías */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: '#2c2c2e',
            backgroundColor: '#1c1c1e',
            marginBottom: 16,
          }}>
          {categorias.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCatActiva(c)}
              style={{
                marginHorizontal: 14,
                paddingVertical: 8,
                paddingHorizontal: 4,
                borderBottomWidth: catActiva === c ? 2 : 0,
                borderBottomColor: '#007AFF',
              }}>
              <Text
                style={{
                  fontSize: tMedio,
                  fontWeight: catActiva === c ? '700' : '500',
                  color: catActiva === c ? '#007AFF' : '#8e8e93',
                }}>
                {c.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista productos */}
        <ScrollView
          contentContainerStyle={{ padding: 14, paddingBottom: carrito.length > 0 ? 200 : 40 }}>
          {productos[catActiva].map((p, index) => (
            <View
              key={`${p.name}-${index}`}
              style={{
                backgroundColor: '#1c1c1e',
                borderRadius: 16,
                marginBottom: 18,
                borderWidth: 1,
                borderColor: '#2c2c2e',
                overflow: 'hidden',
              }}>
              <Image
                source={p.image}
                style={{
                  width: '100%',
                  height: height * 0.25,
                }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                <Text
                  style={{ fontSize: tMedio, fontWeight: '700', marginBottom: 6, color: '#fff' }}>
                  {p.name}
                </Text>
                <Text
                  style={{ fontSize: tPeque, color: '#8e8e93', marginBottom: 12, lineHeight: 18 }}>
                  {p.description}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: tMedio + 2, fontWeight: '700', color: '#007AFF' }}>
                    S/ {(p.price || 0).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => agregarCarrito(p)}
                    style={{
                      backgroundColor: '#007AFF',
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 30,
                      shadowColor: '#007AFF',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                    }}>
                    <Text style={{ color: 'white', fontSize: tMedio, fontWeight: '600' }}>
                      Agregar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Carrito flotante */}
      {carrito.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1c1c1e',
            borderTopWidth: 1,
            borderTopColor: '#2c2c2e',
            padding: 20,
            paddingBottom: 40,
          }}>
          {/* Lista resumida del carrito */}
          <ScrollView
            style={{ maxHeight: 100, marginBottom: 16 }}
            showsVerticalScrollIndicator={false}>
            {carrito.map((item, index) => (
              <View
                key={`${item.name}-${index}`}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  paddingVertical: 8,
                  borderBottomWidth: index < carrito.length - 1 ? 1 : 0,
                  borderBottomColor: '#2c2c2e',
                }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: '#8e8e93', fontSize: 12 }}>
                    S/ {item.price.toFixed(2)} x {item.cantidad || 1}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => quitarDelCarrito(item.name)}
                    style={{
                      backgroundColor: '#2c2c2e',
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>-</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '600',
                      width: 30,
                      textAlign: 'center',
                    }}>
                    {item.cantidad || 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => agregarCarrito(item)}
                    style={{
                      backgroundColor: '#007AFF',
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Total y botón continuar */}
          <View
            style={{
              backgroundColor: '#007AFF',
              borderRadius: 16,
              padding: 20,
              shadowColor: '#007AFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 }}>
                  Dulcería
                </Text>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                  S/ {calcularTotalCarrito().toFixed(2)}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 }}>
                  Total
                </Text>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                  S/ {calcularTotalGeneral().toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                paddingVertical: 16,
              }}
              onPress={() => handleContinue(carrito, calcularTotalCarrito())}
              activeOpacity={0.8}>
              <Text
                style={{
                  color: '#007AFF',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Continuar al Pago
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón omitir dulcería cuando no hay productos en el carrito */}
      {carrito.length === 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#1c1c1e',
              borderWidth: 1,
              borderColor: '#2c2c2e',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={() => handleContinue([], 0)}>
            <Text style={{ color: '#8e8e93', fontSize: 16, fontWeight: '600' }}>
              Continuar sin dulcería
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
