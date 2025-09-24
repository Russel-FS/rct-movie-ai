import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Datos de ejemplo
const movie = {
  title: 'Dune: Parte Dos',
  genre: 'Ciencia Ficción',
  duration: '2h 46m',
  rating: '8.5',
  classification: 'PG-13',
  description: 'La épica continuación de la saga de Duna sigue a Paul en su viaje heroico mientras navega por las traicioneras arenas políticas y literales de Arrakis.',
  synopsis: 'Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia. Enfrentando una difícil elección entre el amor y el destino del universo conocido, Paul se esfuerza por evitar un futuro terrible que solo él puede prever.',
};

const cinemas = [
  {
    id: 1,
    name: 'Cinépolis Plaza Norte',
    address: 'Av. Constituyentes 1050, Col. Centro',
    distance: '2.3 km',
    horarios: ['15:00', '17:30', '20:00'],
  },
  {
    id: 2,
    name: 'Cinemex Galerías',
    address: 'Blvd. Miguel de Cervantes 1200',
    distance: '4.8 km',
    horarios: ['16:00', '18:30', '21:00'],
  },
  {
    id: 3,
    name: 'Cinépolis VIP Centro',
    address: 'Calle Madero 445, Centro Histórico',
    distance: '5.8 km',
    horarios: ['14:30', '19:00'],
  },
];

export default function SeleccionLugar() {
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showGenreAccordion, setShowGenreAccordion] = useState(false);
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Header mejorado */}
      <View className="relative">
        {/* Sombra superior */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 32,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          zIndex: 1,
        }} />
        <View className="bg-black pb-4 pt-8 px-4 rounded-b-2xl items-center">
          <View className="absolute left-4 top-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-800 rounded-full w-9 h-9 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-white text-xl">{'‹'}</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-white text-2xl font-bold mb-1">Seleccionar Cine</Text>
          <Text className="text-gray-300 text-base mb-1">{movie.title} · {movie.genre}</Text>
          <View className="flex-row items-center justify-center w-full">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
              <View style={{ width: 32, height: 1, backgroundColor: '#444', marginRight: 4 }} />
              <Text className="text-gray-400 text-sm">Ficción</Text>
              <View className="w-2 h-2 rounded-full bg-gray-700 ml-2" />
            </View>
          </View>
        </View>
      </View>

      {/* Movie Card */}
      <View className="mx-4 mt-4 mb-2 bg-gray-900 rounded-xl p-4 shadow-lg">
        <View className="flex-row items-center mb-2">
          <View className="bg-gray-800 rounded-lg w-16 h-16 items-center justify-center mr-4">
            <Text className="text-white font-bold text-lg">DUNE</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-base font-bold">{movie.title}</Text>
            <Text className="text-gray-400 text-xs">{movie.genre} · {movie.duration}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-yellow-400 font-bold mr-1">★</Text>
              <Text className="text-yellow-400 font-semibold">{movie.rating}</Text>
              <Text className="text-gray-400 ml-3">{movie.classification}</Text>
            </View>
          </View>
        </View>
        <View className="flex-row mb-2">
          <TouchableOpacity
            className={`flex-1 mr-2 rounded-lg py-2 ${!showSynopsis ? 'bg-blue-600' : 'bg-gray-800'}`}
            onPress={() => setShowSynopsis(false)}
          >
            <Text className={`text-center font-semibold ${!showSynopsis ? 'text-white' : 'text-gray-300'}`}>Descripción Breve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-lg py-2 ${showSynopsis ? 'bg-blue-600' : 'bg-gray-800'}`}
            onPress={() => setShowSynopsis(true)}
          >
            <Text className={`text-center font-semibold ${showSynopsis ? 'text-white' : 'text-gray-300'}`}>Sinopsis Completa</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-gray-800 rounded-lg p-3 mb-3">
          <Text className="text-gray-200 text-sm">
            {showSynopsis ? movie.synopsis : movie.description}
          </Text>
        </View>

        {/* Género y Clasificación Accordion */}
        <View className="bg-black rounded-xl mb-2 border border-gray-800">
          <TouchableOpacity
            className="flex-row items-center px-4 py-3"
            onPress={() => setShowGenreAccordion(!showGenreAccordion)}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold flex-1">Género y Clasificación</Text>
            <View style={{
              transform: [{ rotate: showGenreAccordion ? '90deg' : '0deg' }]
            }}>
              <Text className="text-gray-400 text-xl">›</Text>
            </View>
          </TouchableOpacity>
          {showGenreAccordion && (
            <View className="px-4 pb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-400">Género Principal</Text>
                <Text className="text-gray-200">{movie.genre}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-400">Duración</Text>
                <Text className="text-gray-200">{movie.duration}</Text>
              </View>
              <View className="flex-row justify-between mb-1 items-center">
                <Text className="text-gray-400">Calificación</Text>
                <View className="flex-row items-center">
                  <Text className="text-yellow-400 mr-1">★</Text>
                  <Text className="text-yellow-300 font-semibold">{movie.rating}/10</Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Clasificación</Text>
                <Text className="text-gray-200">{movie.classification}</Text>
              </View>
            </View>
          )}
        </View>
        <View className="flex-row items-center mt-1 mb-1">
          <View className="w-4 h-4 rounded-full border-2 border-blue-500 items-center justify-center mr-2">
            <View className="w-2 h-2 rounded-full bg-blue-500" />
          </View>
          <Text className="text-gray-400 text-xs">Ordenado por distancia</Text>
        </View>
      </View>

      {/* Lista de cines */}
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-white text-lg font-semibold mb-4">Seleccionar Cine</Text>
        {cinemas.map((cine) => (
          <View
            key={cine.id}
            className={`mb-4 rounded-xl p-4 ${selectedCinema === cine.id ? 'bg-gray-800 border-2 border-blue-500' : 'bg-gray-800'}`}
          >
            <TouchableOpacity onPress={() => { setSelectedCinema(cine.id); setSelectedHorario(null); }}>
              <Text className="text-white text-base font-semibold">{cine.name}</Text>
              <Text className="text-gray-400 text-sm">{cine.address}</Text>
              <Text className="text-gray-500 text-xs mb-2">{cine.distance} de tu ubicación</Text>
            </TouchableOpacity>
            {/* Horarios */}
            {selectedCinema === cine.id && (
              <View className="flex-row flex-wrap gap-2 mt-2">
                {cine.horarios.map((hora) => (
                  <TouchableOpacity
                    key={hora}
                    className={`apple-button ${selectedHorario === hora ? 'bg-blue-700' : 'bg-blue-500'}`}
                    onPress={() => setSelectedHorario(hora)}
                  >
                    <Text className="text-white font-semibold">{hora}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Footer dinámico */}
      <View className="px-4 py-4 bg-gray-900 border-t border-gray-800">
        {selectedCinema !== null && selectedHorario !== null ? (
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-semibold">{cinemas.find(c => c.id === selectedCinema)?.name}</Text>
              <Text className="text-gray-400 text-sm">{selectedHorario}</Text>
            </View>
            <TouchableOpacity
              className="apple-button"
              onPress={() => router.push('/src/cartelera/pages/SeleccionButacas')}
            >
              <Text className="text-white font-semibold">Continuar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text className="text-gray-400 text-center">Selecciona un cine y horario para continuar</Text>
        )}
      </View>
    </View>
  );
}