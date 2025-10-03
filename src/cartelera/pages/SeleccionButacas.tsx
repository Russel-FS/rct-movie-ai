import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Fila, Asiento } from '../../shared/types/cinema';
import { RootStackParamList } from '../../shared/types/navigation';
import { ChevronLeft, MapPin, Clock } from 'lucide-react-native';
import { FuncionService } from '../../shared/services/funcion.service';
import { Funcion } from '../../shared/types/funcion';
import { useButacas } from '../../shared/hooks/useButacas';

type SeleccionButacasRouteProp = RouteProp<RootStackParamList, 'SeleccionButacas'>;
type SeleccionButacasNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SeleccionButacas'
>;

export default function SeleccionButacas() {
  const navigation = useNavigation<SeleccionButacasNavigationProp>();
  const route = useRoute<SeleccionButacasRouteProp>();
  const { funcionId, peliculaId, cinemaId, cinemaName } = route.params;
  const [funcion, setFuncion] = useState<Funcion | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook para manejar las butacas
  const {
    filasData,
    asientosSeleccionados,
    loading: loadingButacas,
    error: errorButacas,
    toggleAsiento,
    calcularTotal,
    getAsientoEstado,
    setAsientosSeleccionados,
  } = useButacas({
    funcionId,
    salaId: funcion?.sala_id || 0,
    precioBase: funcion?.precio_base || 0,
  });

  useEffect(() => {
    loadFuncion();
  }, [funcionId]);

  const loadFuncion = async () => {
    try {
      setLoading(true);
      const funcionData = await FuncionService.getFuncionById(funcionId);
      setFuncion(funcionData);
    } catch (error) {
      console.error('Error al cargar función:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extraer datos de la función
  const fechaHora = funcion ? new Date(funcion.fecha_hora) : null;
  const fecha = fechaHora ? fechaHora.toLocaleDateString('es-ES') : '';
  const hora = fechaHora
    ? fechaHora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const sala = funcion?.sala?.nombre || 'N/A';
  const formato = funcion?.formato || 'N/A';
  const precio = funcion?.precio_base || 0;

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

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    // Verificar que la fecha sea válida
    if (isNaN(fecha.getTime())) return fechaStr;

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
        className={`m-1 h-7 w-7 items-center justify-center rounded-full ${
          estado === 'disponible'
            ? 'border border-gray-600 bg-gray-800'
            : estado === 'seleccionado'
              ? 'bg-white'
              : 'bg-gray-600 opacity-40'
        }`}>
        {estado === 'seleccionado' && <View className="h-1.5 w-1.5 rounded-full bg-black" />}
        {estado === 'ocupado' && <View className="h-0.5 w-3 rotate-45 rounded bg-gray-400" />}
      </TouchableOpacity>
    );
  };

  const renderFila = (fila: Fila) => {
    return (
      <View key={fila.letra} className="mb-4 flex-row items-center px-1">
        <Text className="w-7 text-center text-sm font-semibold tracking-wide text-gray-400">
          {fila.letra}
        </Text>
        <View className="flex-1 flex-row justify-center">
          <View className="flex-1 flex-row flex-wrap justify-end pr-2">
            {fila.asientos.slice(0, 6).map(renderAsiento)}
          </View>
          <View className="w-6" />
          <View className="flex-1 flex-row flex-wrap justify-start pl-2">
            {fila.asientos.slice(6, 12).map(renderAsiento)}
          </View>
        </View>
        <View className="w-7" />
      </View>
    );
  };

  if (loading || loadingButacas) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-base text-white">
          {loading ? 'Cargando información de la función...' : 'Cargando butacas...'}
        </Text>
      </View>
    );
  }

  if (errorButacas) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <Text className="mb-4 text-center text-lg text-white">Error al cargar las butacas</Text>
        <Text className="mb-6 text-center text-base text-gray-400">{errorButacas}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full bg-white px-6 py-3">
          <Text className="text-base font-semibold text-black">Volver</Text>
        </TouchableOpacity>
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
                <Text className="text-sm font-medium text-gray-400">Seleccionar asientos</Text>
                <Text className="text-2xl font-bold text-white">Elige tu lugar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info de la función */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <View className="mb-4 flex-row items-center">
              <MapPin size={16} color="#9CA3AF" />
              <Text className="ml-2 text-lg font-bold text-white">{cinemaName}</Text>
            </View>

            <Text className="mb-4 text-xl font-bold text-white">
              {sala} • {formato}
            </Text>

            <View className="flex-row items-center space-x-6">
              <View>
                <Text className="text-sm font-medium text-gray-400">Fecha</Text>
                <Text className="text-base font-medium text-white">
                  {funcion ? formatFecha(funcion.fecha_hora) : 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-base font-medium text-white">{hora}</Text>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-400">Precio</Text>
                <Text className="text-base font-medium text-white">
                  S/ {(precio || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pantalla */}
        <View className="mb-12 items-center">
          <View className="mb-4 h-1.5 w-80 rounded-full bg-gray-800" />
          <Text className="text-xs font-semibold tracking-widest text-gray-500">PANTALLA</Text>
        </View>

        {/* Mapa de asientos */}
        <View className="mx-4 mb-8 rounded-3xl bg-gray-800/50 p-5">
          {filasData.map(renderFila)}
        </View>

        {/* Leyenda */}
        <View className="mx-4 mb-8">
          <View className="rounded-3xl bg-gray-800/50 p-6">
            <View className="flex-row flex-wrap items-center justify-center gap-6">
              <View className="flex-row items-center">
                <View className="mr-3 h-6 w-6 rounded-full border border-gray-600 bg-gray-800" />
                <Text className="text-sm font-medium text-white">Disponible</Text>
              </View>

              <View className="flex-row items-center">
                <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-white">
                  <View className="h-1.5 w-1.5 rounded-full bg-black" />
                </View>
                <Text className="text-sm font-medium text-white">Seleccionado</Text>
              </View>

              <View className="flex-row items-center">
                <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-gray-600 opacity-40">
                  <View className="h-0.5 w-3 rotate-45 rounded bg-gray-400" />
                </View>
                <Text className="text-sm font-medium text-white">Ocupado</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Resumen de selección */}
        {asientosSeleccionados.length > 0 && (
          <View className="mx-4 mb-8">
            <View className="rounded-3xl bg-white p-6">
              <View className="mb-6 flex-row items-start justify-between">
                <View className="flex-1 pr-4">
                  <Text className="mb-2 text-xl font-bold text-black">
                    {asientosSeleccionados.length} asiento
                    {asientosSeleccionados.length > 1 ? 's' : ''}
                  </Text>
                  <Text className="text-base text-gray-600" numberOfLines={3}>
                    {asientosSeleccionados.join(' • ')}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-black">
                    S/ {calcularTotal().toLocaleString()}
                  </Text>
                  <Text className="text-sm font-medium text-gray-600">Total</Text>
                </View>
              </View>

              <TouchableOpacity
                className="rounded-full bg-black px-6 py-4"
                onPress={handleContinue}
                activeOpacity={0.8}>
                <Text className="text-center text-lg font-bold text-white">Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mensaje informativo */}
        <View className="px-4 pb-12">
          <Text className="text-center text-base leading-6 text-gray-400">
            Las filas centrales ofrecen la mejor experiencia.{'\n'}
            Toca para seleccionar tus asientos favoritos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
