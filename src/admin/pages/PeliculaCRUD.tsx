import { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  Switch,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Plus,
  Edit3,
  Search,
  X,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Film,
  Star,
  CalendarDays,
  Clock,
  ChevronRight,
  User,
  Globe,
  ImageIcon,
  Play,
  Tag,
  Languages,
  Subtitles,
  ChevronDown,
  Check,
  Info,
  Sparkles,
  Calendar,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar as CalendarPicker } from 'react-native-calendars';
import {
  Pelicula,
  CreatePeliculaDto,
  UpdatePeliculaDto,
  Clasificacion,
} from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '~/home/services/pelicula.service';
import { GeneroService } from '~/home/services/genero.service';

const { width } = Dimensions.get('window');

const clasificaciones: Clasificacion[] = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

export default function PeliculaCRUD() {
  // Estados principales
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPelicula, setEditingPelicula] = useState<Pelicula | null>(null);
  const [formData, setFormData] = useState<CreatePeliculaDto>({
    titulo: '',
    titulo_original: '',
    sinopsis: '',
    duracion: 0,
    clasificacion: 'PG',
    idioma_original: '',
    subtitulos: '',
    director: '',
    reparto: '',
    poster_url: '',
    trailer_url: '',
    fecha_estreno: '',
    fecha_fin_exhibicion: '',
    generos_ids: [],
  });
  const [formLoading, setFormLoading] = useState(false);

  // Estados para selectores de fecha
  const [showDatePicker, setShowDatePicker] = useState<'estreno' | 'fin' | null>(null);
  const [showGenreSelector, setShowGenreSelector] = useState(false);
  const [showClassificationSelector, setShowClassificationSelector] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [peliculasData, generosData] = await Promise.all([
        showInactive ? PeliculaService.getAllPeliculas() : PeliculaService.getPeliculas(),
        GeneroService.getGeneros(),
      ]);
      setPeliculas(peliculasData);
      setGeneros(generosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar películas por búsqueda
  const filteredPeliculas = peliculas.filter(
    (pelicula) =>
      pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pelicula.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pelicula.sinopsis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear película
  const openCreateModal = () => {
    setEditingPelicula(null);
    setFormData({
      titulo: '',
      titulo_original: '',
      sinopsis: '',
      duracion: 0,
      clasificacion: 'PG',
      idioma_original: '',
      subtitulos: '',
      director: '',
      reparto: '',
      poster_url: '',
      trailer_url: '',
      fecha_estreno: '',
      fecha_fin_exhibicion: '',
      generos_ids: [],
    });
    setModalVisible(true);
  };

  // Abrir modal para editar película
  const openEditModal = async (pelicula: Pelicula) => {
    try {
      setEditingPelicula(pelicula);

      // Cargar géneros de la película
      const generosIds = await PeliculaService.getGenerosPelicula(pelicula.id);

      setFormData({
        titulo: pelicula.titulo,
        titulo_original: pelicula.titulo_original || '',
        sinopsis: pelicula.sinopsis || '',
        duracion: pelicula.duracion,
        clasificacion: pelicula.clasificacion,
        idioma_original: pelicula.idioma_original || '',
        subtitulos: pelicula.subtitulos || '',
        director: pelicula.director || '',
        reparto: pelicula.reparto || '',
        poster_url: pelicula.poster_url || '',
        trailer_url: pelicula.trailer_url || '',
        fecha_estreno: pelicula.fecha_estreno || '',
        fecha_fin_exhibicion: pelicula.fecha_fin_exhibicion || '',
        generos_ids: generosIds,
      });
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de la película');
    }
  };

  // Guardar película (crear o editar)
  const handleSave = async () => {
    // Validaciones
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    if (formData.duracion <= 0) {
      Alert.alert('Error', 'La duración debe ser mayor a 0');
      return;
    }

    if (!formData.generos_ids || formData.generos_ids.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un género para la película');
      return;
    }

    // Validar URLs si se proporcionan
    if (formData.poster_url && !isValidUrl(formData.poster_url)) {
      Alert.alert('Error', 'La URL del póster no es válida');
      return;
    }

    if (formData.trailer_url && !isValidUrl(formData.trailer_url)) {
      Alert.alert('Error', 'La URL del tráiler no es válida');
      return;
    }

    try {
      setFormLoading(true);

      if (editingPelicula) {
        await PeliculaService.modificarPelicula(editingPelicula.id, formData as UpdatePeliculaDto);
        Alert.alert('Éxito', 'Película actualizada correctamente');
      } else {
        await PeliculaService.agregarPelicula(formData);
        Alert.alert('Éxito', 'Película creada correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingPelicula ? 'actualizar' : 'crear'} la película`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Función auxiliar para validar URLs
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Funciones para manejar fechas
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return 'Seleccionar fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    // Generar fechas desde hoy hasta 2 años en el futuro
    for (let i = 0; i < 730; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      options.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      });
    }
    return options;
  };

  // Cambiar estado de película
  const togglePeliculaStatus = async (pelicula: Pelicula) => {
    try {
      await PeliculaService.actualizarEstadoPelicula(pelicula.id, !pelicula.activa);
      loadData();
      Alert.alert(
        'Éxito',
        `Película ${!pelicula.activa ? 'activada' : 'desactivada'} correctamente`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la película');
    }
  };

  // Cambiar estado destacado
  const toggleDestacada = async (pelicula: Pelicula) => {
    try {
      await PeliculaService.actualizarDestacado(pelicula.id, !pelicula.destacada);
      loadData();
      Alert.alert(
        'Éxito',
        `Película ${!pelicula.destacada ? 'marcada como destacada' : 'desmarcada como destacada'}`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado destacado');
    }
  };

  // Componente de tarjeta de película estilo Perfil
  const PeliculaCard = ({ pelicula }: { pelicula: Pelicula }) => (
    <Pressable
      className="mx-4 mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      onPress={() => openEditModal(pelicula)}
      style={{ opacity: 1 }}>
      <View className="p-6">
        <View className="flex-row items-start">
          <View className="mr-4 rounded-full bg-gray-700/50 p-3">
            <Film size={20} color="#9CA3AF" />
          </View>

          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
                {pelicula.titulo}
              </Text>
              <Text className="ml-3 text-xs text-gray-400">ID: {pelicula.id}</Text>
            </View>

            {pelicula.director && (
              <View className="mb-2 flex-row items-center">
                <User size={12} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-400">{pelicula.director}</Text>
              </View>
            )}

            <View className="mb-2 flex-row items-center">
              <Clock size={12} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-400">{pelicula.duracion} min</Text>
              <Text className="ml-3 text-xs text-gray-500">{pelicula.clasificacion}</Text>
            </View>

            {pelicula.sinopsis && (
              <Text className="mb-3 text-sm text-gray-400" numberOfLines={2}>
                {pelicula.sinopsis}
              </Text>
            )}

            {/* Badges de estado y controles */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row flex-wrap">
                {!pelicula.activa && (
                  <View className="mr-2 rounded-full bg-red-500/10 px-3 py-1">
                    <Text className="text-xs font-medium text-red-400">Inactiva</Text>
                  </View>
                )}
                {pelicula.destacada && (
                  <View className="mr-2 rounded-full bg-yellow-500/10 px-3 py-1">
                    <Text className="text-xs font-medium text-yellow-400">Destacada</Text>
                  </View>
                )}
                {pelicula.calificacion && (
                  <View className="mr-2 flex-row items-center rounded-full bg-green-500/10 px-3 py-1">
                    <Star size={10} color="#10B981" fill="#10B981" />
                    <Text className="ml-1 text-xs font-medium text-green-400">
                      {pelicula.calificacion.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row space-x-2">
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleDestacada(pelicula);
                  }}
                  className={`rounded-full px-3 py-1 ${
                    pelicula.destacada ? 'bg-yellow-500/10' : 'bg-gray-600/50'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${
                      pelicula.destacada ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                    {pelicula.destacada ? 'Destacada' : 'Destacar'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    togglePeliculaStatus(pelicula);
                  }}
                  className={`rounded-full px-3 py-1 ${
                    pelicula.activa ? 'bg-red-500/10' : 'bg-green-500/10'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${
                      pelicula.activa ? 'text-red-400' : 'text-green-400'
                    }`}>
                    {pelicula.activa ? 'Desactivar' : 'Activar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="ml-2">
            <ChevronRight size={20} color="#6B7280" />
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando películas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header estilo Perfil */}
      <View className="px-4 pb-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-400">Administración</Text>
            <Text className="text-2xl font-bold text-white">Películas</Text>
          </View>
          <Pressable onPress={loadData} className="rounded-full bg-gray-800/50 p-3">
            <RotateCcw size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Stats y controles */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredPeliculas.length} película{filteredPeliculas.length !== 1 ? 's' : ''}{' '}
            encontrada{filteredPeliculas.length !== 1 ? 's' : ''}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-3 text-sm font-medium text-gray-400">Mostrar inactivas</Text>
            <Switch
              value={showInactive}
              onValueChange={setShowInactive}
              trackColor={{ false: '#374151', true: '#FFFFFF' }}
              thumbColor={showInactive ? '#000000' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Barra de búsqueda y botón crear */}
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar películas..."
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 text-white"
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
            />
          </View>

          <Pressable onPress={openCreateModal} className="rounded-full bg-gray-800/50 p-3">
            <Plus size={20} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>

      {/* Lista de películas */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredPeliculas.length > 0 ? (
          filteredPeliculas.map((pelicula) => (
            <PeliculaCard key={pelicula.id} pelicula={pelicula} />
          ))
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <Film size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron películas</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay películas disponibles'}
            </Text>
            {!searchTerm && (
              <Pressable
                onPress={openCreateModal}
                className="mt-6 overflow-hidden rounded-3xl bg-gray-800/50 px-6 py-3">
                <View className="flex-row items-center">
                  <Plus size={20} color="#9CA3AF" />
                  <Text className="ml-2 font-medium text-white">Agregar Película</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario estilo Perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          className="flex-1 bg-black/50"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View className="mt-12 flex-1 rounded-t-3xl bg-black px-6 py-6">
            {/* Header del modal */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingPelicula ? 'Editar Película' : 'Nueva Película'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-gray-800/50 p-2">
                <X size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* Formulario */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled">
              <View className="space-y-4">
                {/* Información Básica */}
                <Text className="mb-4 text-lg font-bold text-white">Información Básica</Text>

                {/* Título */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Título *</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.titulo}
                      onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                      placeholder="Ej: Avengers: Endgame"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Título Original */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Título Original</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.titulo_original}
                      onChangeText={(text) => setFormData({ ...formData, titulo_original: text })}
                      placeholder="Título en idioma original (opcional)"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Sinopsis */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Sinopsis</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.sinopsis}
                      onChangeText={(text) => setFormData({ ...formData, sinopsis: text })}
                      placeholder="Describe la trama de la película..."
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      maxLength={500}
                    />
                  </View>
                  <Text className="mt-1 text-xs text-gray-400">
                    {(formData.sinopsis || '').length}/500 caracteres
                  </Text>
                </View>

                {/* Detalles Técnicos */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Detalles Técnicos</Text>

                {/* Duración y Clasificación */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Duración (min) *</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.duracion.toString()}
                        onChangeText={(text) => {
                          const duracion = text === '' ? 0 : parseInt(text) || 0;
                          setFormData({ ...formData, duracion });
                        }}
                        placeholder="120"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Clasificación *</Text>
                    <Pressable
                      onPress={() => setShowClassificationSelector(!showClassificationSelector)}
                      className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                      <Text className="text-white">{formData.clasificacion}</Text>
                      <ChevronDown size={20} color="#9CA3AF" />
                    </Pressable>

                    {showClassificationSelector && (
                      <View className="mt-2 overflow-hidden rounded-3xl bg-gray-800/30">
                        {clasificaciones.map((clasificacion) => (
                          <Pressable
                            key={clasificacion}
                            onPress={() => {
                              setFormData({ ...formData, clasificacion });
                              setShowClassificationSelector(false);
                            }}
                            className="flex-row items-center justify-between px-4 py-3">
                            <Text className="text-white">{clasificacion}</Text>
                            {formData.clasificacion === clasificacion && (
                              <Check size={16} color="#9CA3AF" />
                            )}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Idioma y Subtítulos */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Idioma Original</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.idioma_original}
                        onChangeText={(text) => setFormData({ ...formData, idioma_original: text })}
                        placeholder="Español, Inglés, etc."
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Subtítulos</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.subtitulos}
                        onChangeText={(text) => setFormData({ ...formData, subtitulos: text })}
                        placeholder="Español, Inglés"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>
                </View>

                {/* Director */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Director</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.director}
                      onChangeText={(text) => setFormData({ ...formData, director: text })}
                      placeholder="Nombre del director"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Reparto */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Reparto Principal</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.reparto}
                      onChangeText={(text) => setFormData({ ...formData, reparto: text })}
                      placeholder="Actor 1, Actor 2, Actor 3..."
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Géneros */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Géneros *</Text>
                <View className="overflow-hidden rounded-3xl bg-gray-800/30 p-4">
                  <View className="flex-row flex-wrap">
                    {generos.map((genero) => {
                      const isSelected = formData.generos_ids?.includes(genero.id) || false;
                      return (
                        <Pressable
                          key={genero.id}
                          onPress={() => {
                            const currentGeneros = formData.generos_ids || [];
                            const newGeneros = isSelected
                              ? currentGeneros.filter((id) => id !== genero.id)
                              : [...currentGeneros, genero.id];
                            setFormData({ ...formData, generos_ids: newGeneros });
                          }}
                          className={`mb-2 mr-2 rounded-full px-3 py-2 ${
                            isSelected ? 'bg-gray-600' : 'bg-gray-700/50'
                          }`}>
                          <Text
                            className={`text-sm font-medium ${
                              isSelected ? 'text-white' : 'text-gray-300'
                            }`}>
                            {genero.nombre}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {(!formData.generos_ids || formData.generos_ids.length === 0) && (
                    <Text className="mt-2 text-xs text-gray-400">
                      Selecciona al menos un género para la película
                    </Text>
                  )}
                </View>

                {/* Multimedia */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Multimedia</Text>

                {/* Poster URL */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">URL del Póster</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.poster_url}
                      onChangeText={(text) => setFormData({ ...formData, poster_url: text })}
                      placeholder="https://ejemplo.com/poster.jpg"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      keyboardType="url"
                    />
                  </View>
                </View>

                {/* Trailer URL */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">URL del Tráiler</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.trailer_url}
                      onChangeText={(text) => setFormData({ ...formData, trailer_url: text })}
                      placeholder="https://youtube.com/watch?v=..."
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      keyboardType="url"
                    />
                  </View>
                </View>

                {/* Fechas de Exhibición */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Fechas de Exhibición</Text>

                {/* Fechas */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Fecha de Estreno</Text>
                    <Pressable
                      onPress={() => setShowDatePicker('estreno')}
                      className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                      <Text className="text-white">
                        {formData.fecha_estreno
                          ? formatDateForDisplay(formData.fecha_estreno)
                          : 'Seleccionar fecha'}
                      </Text>
                      <Calendar size={20} color="#9CA3AF" />
                    </Pressable>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Fecha Fin Exhibición</Text>
                    <Pressable
                      onPress={() => setShowDatePicker('fin')}
                      className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                      <Text className="text-white">
                        {formData.fecha_fin_exhibicion
                          ? formatDateForDisplay(formData.fecha_fin_exhibicion)
                          : 'Seleccionar fecha'}
                      </Text>
                      <Calendar size={20} color="#9CA3AF" />
                    </Pressable>
                  </View>
                </View>

                {/* Información adicional para edición */}
                {editingPelicula && (
                  <View className="mt-6 rounded-3xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información de la Película
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingPelicula.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingPelicula.activa ? 'Activa' : 'Inactiva'}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Destacada: {editingPelicula.destacada ? 'Sí' : 'No'}
                    </Text>
                    {editingPelicula.calificacion && (
                      <Text className="text-xs text-gray-300">
                        Calificación: {editingPelicula.calificacion.toFixed(1)} (
                        {editingPelicula.votos} votos)
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mb-6 mt-6 flex-row space-x-3" style={{ paddingBottom: 20 }}>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-3xl bg-gray-800/50 px-4 py-3">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={
                  formLoading ||
                  !formData.titulo.trim() ||
                  formData.duracion <= 0 ||
                  !formData.generos_ids ||
                  formData.generos_ids.length === 0
                }
                className={`flex-1 rounded-3xl px-4 py-3 ${
                  formLoading ||
                  !formData.titulo.trim() ||
                  formData.duracion <= 0 ||
                  !formData.generos_ids ||
                  formData.generos_ids.length === 0
                    ? 'bg-gray-600/50'
                    : 'bg-gray-800/50'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-white">
                      {editingPelicula ? 'Actualizar' : 'Crear'}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Calendario */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker !== null}
        onRequestClose={() => setShowDatePicker(null)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-black p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">
                {showDatePicker === 'estreno' ? 'Fecha de Estreno' : 'Fecha Fin Exhibición'}
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(null)}
                className="rounded-full bg-gray-800/50 p-2">
                <X size={16} color="#9CA3AF" />
              </Pressable>
            </View>

            <CalendarPicker
              onDayPress={(day) => {
                if (showDatePicker === 'estreno') {
                  setFormData({ ...formData, fecha_estreno: day.dateString });
                } else {
                  setFormData({ ...formData, fecha_fin_exhibicion: day.dateString });
                }
                setShowDatePicker(null);
              }}
              markedDates={{
                ...(formData.fecha_estreno && {
                  [formData.fecha_estreno]: { selected: true, selectedColor: '#374151' },
                }),
                ...(formData.fecha_fin_exhibicion && {
                  [formData.fecha_fin_exhibicion]: { selected: true, selectedColor: '#6B7280' },
                }),
              }}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: '#9CA3AF',
                selectedDayBackgroundColor: '#374151',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#9CA3AF',
                dayTextColor: '#ffffff',
                textDisabledColor: '#4B5563',
                dotColor: '#9CA3AF',
                selectedDotColor: '#ffffff',
                arrowColor: '#9CA3AF',
                monthTextColor: '#ffffff',
                indicatorColor: '#9CA3AF',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              minDate={new Date().toISOString().split('T')[0]}
              firstDay={1}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
