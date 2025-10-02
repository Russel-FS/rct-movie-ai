import { useMemo, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Fila, Asiento } from '~/shared/types/cinema';
import { RootStackParamList } from '~/shared/types/navigation';
import { ChevronLeft, MapPin, Clock } from 'lucide-react-native';

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
                <Text className="text-base font-medium text-white">{formatFecha(fecha)}</Text>
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
