import { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/shared/types/navigation';
import { ChevronLeft, MapPin, Clock, Calendar } from 'lucide-react-native';
import { ProductoService } from '~/shared/services/producto.service';
import { CategoriaProductoService } from '~/shared/services/categoria-producto.service';
import { Producto } from '~/shared/types/producto';
import { CategoriaProducto } from '~/shared/types/categoria-producto';

type ProductoCarrito = {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  image: string;
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

  // Estados para datos de la BD
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [catActiva, setCatActiva] = useState<number | null>(null);
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriasData, productosData] = await Promise.all([
        CategoriaProductoService.getAllCategorias(false),
        ProductoService.getAllProductos(false),
      ]);

      setCategorias(categoriasData.sort((a, b) => a.orden - b.orden));
      setProductos(productosData.sort((a, b) => a.orden - b.orden));

      // categoría por defecto
      if (categoriasData.length > 0) {
        setCatActiva(categoriasData[0].id);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría activa
  const productosFiltrados = productos.filter((p) => p.categoria_id === catActiva);

  const handleContinue = (comidas: ProductoCarrito[], subtotalComidas: number) => {
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
      comidas: comidas.map((c) => ({
        id: c.id,
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

  const agregarCarrito = (producto: Producto) => {
    const productoCarrito: ProductoCarrito = {
      id: producto.id,
      name: producto.nombre,
      description: producto.descripcion || '',
      price: producto.precio,
      type: producto.categoria?.nombre || '',
      image: producto.imagen_url || '',
    };
    const productoExistente = carrito.find((p) => p.id === productoCarrito.id);
    if (productoExistente) {
      setCarrito(
        carrito.map((p) =>
          p.id === productoCarrito.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...productoCarrito, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId: number) => {
    const producto = carrito.find((p) => p.id === productoId);
    if (producto && (producto.cantidad || 1) > 1) {
      setCarrito(
        carrito.map((p) => (p.id === productoId ? { ...p, cantidad: (p.cantidad || 1) - 1 } : p))
      );
    } else {
      setCarrito(carrito.filter((p) => p.id !== productoId));
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
    if (!fechaStr) return '';

    if (fechaStr.includes('/') || fechaStr.includes('-')) {
      try {
        const fecha = new Date(fechaStr);

        if (isNaN(fecha.getTime())) {
          return fechaStr;
        }
        return fecha.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      } catch (error) {
        return fechaStr;
      }
    }

    return fechaStr;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">Cargando productos...</Text>
      </View>
    );
  }

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
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                onPress={() => setCatActiva(categoria.id)}
                className={`mr-4 rounded-full px-6 py-3 ${
                  catActiva === categoria.id ? 'bg-white' : 'bg-gray-800/50'
                }`}
                activeOpacity={0.8}>
                <View className="flex-row items-center">
                  {categoria.icono && <Text className="mr-2 text-base">{categoria.icono}</Text>}
                  <Text
                    className={`text-base font-semibold ${
                      catActiva === categoria.id ? 'text-black' : 'text-gray-400'
                    }`}>
                    {categoria.nombre}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista productos */}
        <View className="px-4" style={{ paddingBottom: carrito.length > 0 ? 200 : 40 }}>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <View key={producto.id} className="mb-6 overflow-hidden rounded-3xl bg-gray-800/50">
                {producto.imagen_url ? (
                  <Image
                    source={{ uri: producto.imagen_url }}
                    style={{
                      width: '100%',
                      height: height * 0.25,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: height * 0.25,
                    }}
                    className="items-center justify-center bg-gray-700/50">
                    <Text className="text-4xl">{producto.categoria?.icono || '🍿'}</Text>
                  </View>
                )}
                <View className="p-6">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="flex-1 text-lg font-bold text-white">{producto.nombre}</Text>
                    {producto.destacado && (
                      <View className="ml-2 rounded-full bg-yellow-500/10 px-2 py-1">
                        <Text className="text-xs font-medium text-yellow-400">Destacado</Text>
                      </View>
                    )}
                  </View>
                  {producto.descripcion && (
                    <Text className="mb-4 text-sm leading-5 text-gray-400">
                      {producto.descripcion}
                    </Text>
                  )}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-white">
                      S/ {producto.precio.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => agregarCarrito(producto)}
                      className="rounded-full bg-white px-6 py-3"
                      activeOpacity={0.8}>
                      <Text className="text-base font-semibold text-black">Agregar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-20">
              <Text className="mb-4 text-4xl">
                {categorias.find((c) => c.id === catActiva)?.icono || '🍿'}
              </Text>
              <Text className="mb-2 text-lg font-medium text-gray-400">
                No hay productos disponibles
              </Text>
              <Text className="text-center text-sm text-gray-500">
                En esta categoría no hay productos disponibles por el momento
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Carrito flotante */}
      {carrito.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-800/50 bg-black p-4 pb-8">
          {/* Lista resumida del carrito */}
          <ScrollView className="mb-4 max-h-24" showsVerticalScrollIndicator={false}>
            {carrito.map((item, index) => (
              <View
                key={`${item.id}-${index}`}
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
                    onPress={() => quitarDelCarrito(item.id)}
                    className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-gray-700"
                    activeOpacity={0.8}>
                    <Text className="text-sm font-bold text-white">-</Text>
                  </TouchableOpacity>
                  <Text className="w-8 text-center text-sm font-semibold text-white">
                    {item.cantidad || 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const productoOriginal = productos.find((p) => p.id === item.id);
                      if (productoOriginal) {
                        agregarCarrito(productoOriginal);
                      }
                    }}
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
