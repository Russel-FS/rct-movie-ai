import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CINES_CERCANOS = [
  { id: '1', nombre: 'Cineplanet Centro', direccion: 'Av. Abancay 123', distancia: 30 },
  { id: '2', nombre: 'Cinemark Lima', direccion: 'Jr. de la Unión 456', distancia: 45 },
  { id: '3', nombre: 'UVK Plaza San Martín', direccion: 'Plaza San Martín 789', distancia: 48 },
  { id: '4', nombre: 'Cinepolis Lima Norte', direccion: 'Av. Alfredo Mendiola 3698', distancia: 50 },
  { id: '5', nombre: 'Cine Star Wilson', direccion: 'Av. Wilson 234', distancia: 40 },
  { id: '6', nombre: 'Cineplanet Risso', direccion: 'Av. Arequipa 1500', distancia: 49 },
  { id: '7', nombre: 'Cinepolis La Rambla', direccion: 'Av. Brasil 701', distancia: 47 },
  { id: '8', nombre: 'Cine Star Benavides', direccion: 'Av. Benavides 1234', distancia: 44 },
];

export default function Cines() {
  const [busqueda, setBusqueda] = useState('');
  const [cines, setCines] = useState(CINES_CERCANOS);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (!buscando) {
      if (!busqueda.trim()) {
        setCines(CINES_CERCANOS);
        return;
      }
      setCines(
        CINES_CERCANOS.filter(
          cine =>
            cine.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            cine.direccion.toLowerCase().includes(busqueda.toLowerCase())
        )
      );
    }
  }, [busqueda, buscando]);

  // Botón "Buscar" muestra animación y luego los resultados
  const handleBuscar = () => {
    setCargando(true);
    setMostrarResultados(false);
    setBuscando(true);
    setTimeout(() => {
      setCargando(false);
      setMostrarResultados(true);
      setBuscando(false);
      if (!busqueda.trim()) {
        setCines(CINES_CERCANOS);
      } else {
        setCines(
          CINES_CERCANOS.filter(
            cine =>
              cine.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
              cine.direccion.toLowerCase().includes(busqueda.toLowerCase())
          )
        );
      }
    }, 1200); // 1.2 segundos de "cargando"
  };

  // Cuando el usuario escribe, vuelve a modo búsqueda reactiva
  const handleChangeBusqueda = (text: string) => {
    setBusqueda(text);
    setBuscando(false);
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setBusqueda('');
    setCines(CINES_CERCANOS);
    setBuscando(false);
    setMostrarResultados(false);
    setCargando(false);
  };

  return (
    <View className="flex-1 items-center justify-start bg-neutral-950 px-4 pt-10">
      {/* Simula mensaje de ubicación */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={18} color="#a5b4fc" style={{ marginRight: 6 }} />
        <Text className="text-indigo-300 text-sm">Usando tu ubicación: Centro de Lima</Text>
      </View>
      {/* Título con ícono de mapa */}
      <View className="flex-row items-center mb-4">
        <Text className="text-2xl font-bold text-white mr-2">Cines cercanos</Text>
        <Ionicons name="map-outline" size={28} color="#a5b4fc" />
      </View>
      <View className="flex-row w-full mb-4 items-center">
        <View className="flex-1 flex-row items-center bg-neutral-900 rounded-lg px-3 py-2 mr-2 border border-neutral-700">
          <Ionicons name="search" size={20} color="#aaa" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-white"
            placeholder="Buscar cine o dirección"
            placeholderTextColor="#888"
            value={busqueda}
            onChangeText={handleChangeBusqueda}
            returnKeyType="search"
            selectionColor="#fff"
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          className="bg-indigo-600 rounded-lg px-4 py-2 active:bg-indigo-700"
          onPress={handleBuscar}
        >
          <Text className="text-white font-semibold">Buscar</Text>
        </TouchableOpacity>
      </View>
      {cargando ? (
        <View className="flex-1 w-full items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-indigo-300 mt-4">Buscando cines cerca de ti...</Text>
        </View>
      ) : mostrarResultados ? (
        <>
          {/* Botón simulado para ver en mapa */}
          <TouchableOpacity className="flex-row items-center mb-3 self-end" style={{ opacity: 0.85 }}>
            <Ionicons name="map" size={20} color="#a5b4fc" style={{ marginRight: 4 }} />
            <Text className="text-indigo-300 font-medium">Ver en mapa</Text>
          </TouchableOpacity>
          <FlatList
            data={cines}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="flex-row items-center bg-neutral-900 rounded-xl p-4 mb-3 w-full border border-neutral-800 shadow-md">
                <Ionicons name="film-outline" size={28} color="#a5b4fc" style={{ marginRight: 14 }} />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white">{item.nombre}</Text>
                  <Text className="text-gray-400">{item.direccion}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-sharp" size={14} color="#6366f1" style={{ marginRight: 4 }} />
                    <Text className="text-xs text-indigo-400">A {item.distancia}m de tu ubicación</Text>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-gray-400 mt-10 text-center">No se encontraron cines cercanos.</Text>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ width: '100%' }}
          />
        </>
      ) : (
        <View className="flex-1" />
      )}
    </View>
  );
}
