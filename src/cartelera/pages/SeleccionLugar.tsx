import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import { Pelicula } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '~/home/services/pelicula.service';
import { GeneroService } from '~/home/services/genero.service';
import { Calendar, Clock, Star, Film, Users, Play } from 'lucide-react-native';

const cinemas = [
  {
    id: 1,
    name: 'Cinépolis Plaza Norte',
    address: 'Av. Constituyentes 1050, Col. Centro',
    distance: '2.3 km'
  },
  {
    id: 2,
    name: 'Cinemex Galerías',
    address: 'Blvd. Miguel de Cervantes 1200',
    distance: '4.8 km'
  },
  {
    id: 3,
    name: 'Cinépolis VIP Centro',
    address: 'Calle Madero 445, Centro Histórico',
    distance: '5.8 km'
  },
];

interface SeleccionLugarProps {
  peliculaId: string;
  onBack?: () => void;
  onContinue?: (cinemaId: number, cinemaName: string) => void;
}

export default function SeleccionLugar({ peliculaId, onBack, onContinue }: SeleccionLugarProps) {
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getGeneros = (): string => {
    if (generos && generos.length > 0) {
      return generos.map(g => g.nombre).join(', ');
    }
    return 'Sin género';
  };

  const handleWatchTrailer = async () => {
    if (!pelicula?.trailer_url) {
      Alert.alert('Tráiler no disponible', 'Este contenido no tiene tráiler disponible en este momento.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(pelicula.trailer_url);
      if (canOpen) {
        await Linking.openURL(pelicula.trailer_url);
      } else {
        Alert.alert('Error', 'No se puede abrir el tráiler');
      }
    } catch (error) {
      console.error('Error al abrir tráiler:', error);
      Alert.alert('Error', 'Hubo un problema al abrir el tráiler');
    }
  };

  const handleContinue = () => {
    if (selectedCinema !== null && onContinue) {
      const cinema = cinemas.find(c => c.id === selectedCinema);
      if (cinema) {
        onContinue(cinema.id, cinema.name);
      }
    }
  };

  useEffect(() => {
    const fetchPelicula = async () => {
      if (!peliculaId) {
        setError('No se proporcionó un ID de película');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await PeliculaService.getPeliculaById(peliculaId);
        setPelicula(data);
        
        // Cargar géneros de la película usando el servicio
        try {
          const generosIds = await PeliculaService.getGenerosPelicula(peliculaId);
          const todosGeneros = await GeneroService.getGeneros();
          const generosFiltrados = todosGeneros.filter(g => generosIds.includes(g.id));
          setGeneros(generosFiltrados);
        } catch (generoError) {
          console.error('Error al cargar géneros:', generoError);
          setGeneros([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar película:', err);
        setError('Error al cargar la información de la película');
      } finally {
        setLoading(false);
      }
    };

    fetchPelicula();
  }, [peliculaId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-white text-base">Cargando película...</Text>
      </View>
    );
  }

  if (error || !pelicula) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-6 text-center text-red-400 text-base">
          {error || 'No se pudo cargar la película'}
        </Text>
        <TouchableOpacity
          onPress={() => onBack ? onBack() : console.log('Volver')}
          className="rounded-xl bg-blue-600 px-8 py-3"
          activeOpacity={0.8}
        >
          <Text className="font-bold text-white text-base">Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-gray-900 pb-6 pt-12 px-6 border-b border-gray-800">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => onBack ? onBack() : console.log('Volver')}
            className="bg-gray-800 rounded-full w-10 h-10 items-center justify-center mr-4"
            activeOpacity={0.7}
          >
            <Text className="text-white text-2xl">{'‹'}</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Seleccionar Cine</Text>
            <Text className="text-gray-400 text-sm mt-1">Elige dónde ver {pelicula.titulo}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Movie Card con Poster */}
        <View className="mx-6 mt-6 mb-6">
          <View className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            {/* Poster con overlay para el trailer */}
            <View className="relative">
              {pelicula.poster_url ? (
                <Image
                  source={{ uri: pelicula.poster_url }}
                  className="w-full h-64"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-64 bg-gray-800 items-center justify-center">
                  <Film size={48} color="#6B7280" />
                  <Text className="text-gray-500 mt-2">Sin imagen</Text>
                </View>
              )}
              
              {/* Botón de tráiler superpuesto */}
              {pelicula.trailer_url && (
                <View className="absolute inset-0 items-center justify-center">
                  <TouchableOpacity
                    onPress={handleWatchTrailer}
                    className="bg-blue-600/90 rounded-full w-16 h-16 items-center justify-center"
                    activeOpacity={0.8}
                  >
                    <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {/* Info Card */}
            <View className="p-6">
              {/* Título y Rating */}
              <View className="mb-4">
                <Text className="text-white text-2xl font-bold mb-2">{pelicula.titulo}</Text>
                {pelicula.titulo_original && pelicula.titulo_original !== pelicula.titulo && (
                  <Text className="text-gray-400 text-sm mb-3">{pelicula.titulo_original}</Text>
                )}
                <View className="flex-row items-center">
                  <View className="flex-row items-center bg-yellow-500/20 rounded-lg px-3 py-2 mr-3">
                    <Star size={16} color="#EAB308" fill="#EAB308" />
                    <Text className="text-yellow-400 font-bold ml-2 text-base">
                      {pelicula.calificacion?.toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                  <View className="bg-gray-800 rounded-lg px-3 py-2">
                    <Text className="text-gray-300 font-semibold">{pelicula.clasificacion}</Text>
                  </View>
                </View>
              </View>

              {/* Botón Ver Tráiler (alternativo, debajo del título) */}
              {pelicula.trailer_url && (
                <TouchableOpacity
                  onPress={handleWatchTrailer}
                  className="bg-red-600 rounded-xl py-3 px-4 flex-row items-center justify-center mb-5"
                  activeOpacity={0.8}
                >
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                  <Text className="text-white font-bold ml-2 text-base">Ver Tráiler</Text>
                </TouchableOpacity>
              )}

              {/* Info Row */}
              <View className="mb-5 space-y-3">
                <View className="flex-row items-center">
                  <Clock size={18} color="#9CA3AF" />
                  <Text className="text-gray-300 ml-3 text-base">{formatDuration(pelicula.duracion)}</Text>
                </View>
                
                <View className="flex-row items-start">
                  <Film size={18} color="#9CA3AF" />
                  <Text className="text-gray-300 ml-3 flex-1 text-base">{getGeneros()}</Text>
                </View>

                {pelicula.fecha_estreno && (
                  <View className="flex-row items-center">
                    <Calendar size={18} color="#9CA3AF" />
                    <Text className="text-gray-300 ml-3 text-base">
                      Estreno: {formatDate(pelicula.fecha_estreno)}
                    </Text>
                  </View>
                )}

                {pelicula.director && (
                  <View className="flex-row items-start">
                    <Users size={18} color="#9CA3AF" />
                    <Text className="text-gray-300 ml-3 flex-1 text-base">
                      Director: {pelicula.director}
                    </Text>
                  </View>
                )}

                {pelicula.idioma_original && (
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">Idioma: </Text>
                    <Text className="text-gray-300 text-sm">{pelicula.idioma_original}</Text>
                  </View>
                )}

                {pelicula.subtitulos && (
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 text-sm">Subtítulos: </Text>
                    <Text className="text-gray-300 text-sm">{pelicula.subtitulos}</Text>
                  </View>
                )}
              </View>

              {/* Sinopsis */}
              {pelicula.sinopsis && (
                <View className="bg-gray-800/50 rounded-xl p-4 mb-4">
                  <Text className="text-white font-semibold mb-2 text-base">Sinopsis</Text>
                  <Text className="text-gray-300 text-sm leading-6">
                    {showFullSynopsis 
                      ? pelicula.sinopsis
                      : pelicula.sinopsis.length > 200
                        ? `${pelicula.sinopsis.substring(0, 200)}...`
                        : pelicula.sinopsis
                    }
                  </Text>
                  {pelicula.sinopsis.length > 200 && (
                    <TouchableOpacity
                      onPress={() => setShowFullSynopsis(!showFullSynopsis)}
                      className="mt-3"
                      activeOpacity={0.7}
                    >
                      <Text className="text-blue-400 font-semibold text-sm">
                        {showFullSynopsis ? 'Ver menos' : 'Ver más'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Reparto */}
              {pelicula.reparto && (
                <View className="bg-gray-800/50 rounded-xl p-4">
                  <Text className="text-white font-semibold mb-2 text-base">Reparto</Text>
                  <Text className="text-gray-300 text-sm leading-6">{pelicula.reparto}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Lista de cines */}
        <View className="px-6 pb-8">
          <Text className="text-white text-xl font-bold mb-4">Seleccionar Cine</Text>
          {cinemas.map((cine) => (
            <View
              key={cine.id}
              className={`mb-4 rounded-2xl p-5 ${
                selectedCinema === cine.id 
                  ? 'bg-gray-800 border-2 border-blue-500' 
                  : 'bg-gray-900'
              }`}
            >
              <TouchableOpacity 
                onPress={() => setSelectedCinema(cine.id)}
                activeOpacity={0.7}
              >
                <Text className="text-white text-lg font-bold mb-2">{cine.name}</Text>
                <Text className="text-gray-400 text-sm mb-1">{cine.address}</Text>
                <Text className="text-gray-500 text-xs">📍 {cine.distance} de tu ubicación</Text>
              </TouchableOpacity>
              

            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer dinámico */}
      <View className="px-6 py-5 bg-gray-900 border-t border-gray-800">
        {selectedCinema !== null ? (
          <View>
            <View className="mb-3">
              <Text className="text-gray-400 text-xs mb-1">Cine seleccionado:</Text>
              <Text className="text-white font-bold text-base">
                {cinemas.find(c => c.id === selectedCinema)?.name}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-blue-600 px-6 py-4 rounded-xl"
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-base">
                Continuar a Selección de Horario
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-gray-800 px-4 py-4 rounded-xl">
            <Text className="text-gray-400 text-center text-sm">
              Selecciona un cine para continuar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}