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
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pb-6 pt-14">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleBack}
                className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-gray-800/50"
                activeOpacity={0.7}>
                <ChevronLeft size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <View>
                <Text className="text-sm font-medium text-gray-400">Dulcería</Text>
                <Text className="text-2xl font-bold text-white">¿Algo para acompañar?</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Resumen de la compra */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <View className="mb-4 flex-row items-center">
              <MapPin size={16} color="#9CA3AF" />
              <Text className="ml-2 text-lg font-bold text-white">{cinemaName}</Text>
            </View>

            <Text className="mb-4 text-xl font-bold text-white">
              {sala} • {formato}
            </Text>

            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="ml-2 text-base font-medium text-white">{formatFecha(fecha)}</Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-base font-medium text-white">{hora}</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400">Asientos seleccionados</Text>
              <Text className="text-base font-medium text-white">
                {asientosSeleccionados.join(', ')}
              </Text>
            </View>

            <View className="border-t border-gray-700 pt-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-gray-300">
                  Entradas ({asientosSeleccionados.length})
                </Text>
                <Text className="text-lg font-bold text-white">
                  S/ {calcularTotalEntradas().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categorías */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {categorias.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCatActiva(c)}
                className={`mr-4 rounded-full px-6 py-3 ${
                  catActiva === c ? 'bg-white' : 'bg-gray-800/50'
                }`}
                activeOpacity={0.8}>
                <Text
                  className={`text-base font-semibold ${
                    catActiva === c ? 'text-black' : 'text-gray-400'
                  }`}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista productos */}
        <View className="px-4" style={{ paddingBottom: carrito.length > 0 ? 200 : 40 }}>
          {productos[catActiva].map((p, index) => (
            <View
              key={`${p.name}-${index}`}
              className="mb-6 overflow-hidden rounded-3xl bg-gray-800/50">
              <Image
                source={p.image}
                style={{
                  width: '100%',
                  height: height * 0.25,
                }}
                resizeMode="cover"
              />
              <View className="p-6">
                <Text className="mb-2 text-lg font-bold text-white">{p.name}</Text>
                <Text className="mb-4 text-sm leading-5 text-gray-400">{p.description}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xl font-bold text-white">
                    S/ {(p.price || 0).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => agregarCarrito(p)}
                    className="rounded-full bg-white px-6 py-3"
                    activeOpacity={0.8}>
                    <Text className="text-base font-semibold text-black">Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Carrito flotante */}
      {carrito.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-800/50 bg-black p-4 pb-8">
          {/* Lista resumida del carrito */}
          <ScrollView className="mb-4 max-h-24" showsVerticalScrollIndicator={false}>
            {carrito.map((item, index) => (
              <View
                key={`${item.name}-${index}`}
                className={`flex-row items-center justify-between py-2 ${
                  index < carrito.length - 1 ? 'border-b border-gray-800' : ''
                }`}>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-white">{item.name}</Text>
                  <Text className="text-xs text-gray-400">
                    S/ {item.price.toFixed(2)} x {item.cantidad || 1}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => quitarDelCarrito(item.name)}
                    className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-gray-700"
                    activeOpacity={0.8}>
                    <Text className="text-sm font-bold text-white">-</Text>
                  </TouchableOpacity>
                  <Text className="w-8 text-center text-sm font-semibold text-white">
                    {item.cantidad || 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => agregarCarrito(item)}
                    className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-white"
                    activeOpacity={0.8}>
                    <Text className="text-sm font-bold text-black">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Total y botón continuar */}
          <View className="rounded-3xl bg-white p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-gray-600">Dulcería</Text>
                <Text className="text-lg font-bold text-black">
                  S/ {calcularTotalCarrito().toFixed(2)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-medium text-gray-600">Total</Text>
                <Text className="text-2xl font-bold text-black">
                  S/ {calcularTotalGeneral().toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="rounded-full bg-black px-6 py-4"
              onPress={() => handleContinue(carrito, calcularTotalCarrito())}
              activeOpacity={0.8}>
              <Text className="text-center text-lg font-bold text-white">Continuar al Pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón omitir dulcería */}
      {carrito.length === 0 && (
        <View className="absolute bottom-4 left-4 right-4">
          <TouchableOpacity
            className="rounded-full bg-gray-800/50 px-6 py-4"
            onPress={() => handleContinue([], 0)}
            activeOpacity={0.8}>
            <Text className="text-center text-lg font-medium text-gray-400">
              Continuar sin dulcería
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
