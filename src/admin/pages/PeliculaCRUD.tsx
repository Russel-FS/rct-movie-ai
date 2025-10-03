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
} from 'react-native';
import {
  Plus,
  Edit,
  Search,
  X,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Film,
  Star,
  Calendar,
  Clock,
  ChevronRight,
  User,
  Globe,
  Image,
  Play,
  Tag,
  Languages,
  Subtitles,
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

  // Componente de tarjeta de película
  const PeliculaCard = ({ pelicula }: { pelicula: Pelicula }) => (
    <View className="mx-2 mb-4 rounded-lg bg-gray-800 p-4">
      <View className="mb-3 flex-row items-start">
        <View className="mr-3 rounded-full bg-blue-600 p-3">
          <Film size={20} color="#ffffff" />
        </View>

        <View className="flex-1">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="flex-1 text-lg font-bold text-white" numberOfLines={1}>
              {pelicula.titulo}
            </Text>
            <Text className="ml-2 text-xs text-gray-400">ID: {pelicula.id}</Text>
          </View>

          {pelicula.director && (
            <Text className="mb-1 text-sm text-gray-300">Director: {pelicula.director}</Text>
          )}

          <View className="mb-2 flex-row items-center">
            <Clock size={12} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-gray-400">{pelicula.duracion} min</Text>
            <Text className="ml-3 rounded bg-gray-700 px-2 py-1 text-xs font-bold text-white">
              {pelicula.clasificacion}
            </Text>
          </View>

          {pelicula.sinopsis && (
            <Text className="mb-2 text-sm text-gray-300" numberOfLines={2}>
              {pelicula.sinopsis}
            </Text>
          )}
        </View>
      </View>

      {/* Badges de estado */}
      <View className="mb-3 flex-row flex-wrap">
        {!pelicula.activa && (
          <View className="mb-1 mr-2 rounded bg-red-600 px-2 py-1">
            <Text className="text-xs font-bold text-white">Inactiva</Text>
          </View>
        )}
        {pelicula.destacada && (
          <View className="mb-1 mr-2 rounded bg-yellow-500 px-2 py-1">
            <Text className="text-xs font-bold text-black">Destacada</Text>
          </View>
        )}
        {pelicula.calificacion && (
          <View className="mb-1 mr-2 flex-row items-center rounded bg-green-600 px-2 py-1">
            <Star size={10} color="#ffffff" fill="#ffffff" />
            <Text className="ml-1 text-xs font-bold text-white">
              {pelicula.calificacion.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Botones de acción */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => openEditModal(pelicula)}
          className="mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 px-3 py-2">
          <Edit size={14} color="#ffffff" />
          <Text className="ml-2 text-sm font-bold text-white">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleDestacada(pelicula)}
          className={`mr-2 flex-row items-center justify-center rounded-lg px-3 py-2 ${
            pelicula.destacada ? 'bg-yellow-600' : 'bg-gray-600'
          }`}>
          <Star size={14} color="#ffffff" fill={pelicula.destacada ? '#ffffff' : 'none'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => togglePeliculaStatus(pelicula)}
          className={`flex-row items-center justify-center rounded-lg px-3 py-2 ${
            pelicula.activa ? 'bg-red-600' : 'bg-green-600'
          }`}>
          {pelicula.activa ? (
            <EyeOff size={14} color="#ffffff" />
          ) : (
            <Eye size={14} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
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
      {/* Header */}
      <View className="px-4 pb-4 pt-4">
        {/* Stats */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredPeliculas.length} película{filteredPeliculas.length !== 1 ? 's' : ''}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-gray-400">Mostrar inactivas</Text>
            <Switch
              value={showInactive}
              onValueChange={setShowInactive}
              trackColor={{ false: '#374151', true: '#3B82F6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Barra de búsqueda y botones */}
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center rounded-lg bg-gray-800 px-4 py-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar películas..."
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 text-white"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <TouchableOpacity
            onPress={openCreateModal}
            className="flex-row items-center rounded-lg bg-green-600 px-4 py-3">
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={loadData}
            className="flex-row items-center rounded-lg bg-blue-600 px-4 py-3">
            <RefreshCw size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de películas */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario - Continuará en la siguiente parte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[90%] rounded-t-3xl bg-gray-900 px-6 py-6">
            {/* Header del modal */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingPelicula ? 'Editar Película' : 'Nueva Película'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Formulario en ScrollView */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="space-y-6">
                {/* Sección: Información Básica */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white">📝 Información Básica</Text>

                  {/* Título */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">Título *</Text>
                    <TextInput
                      value={formData.titulo}
                      onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                      placeholder="Ej: Avengers: Endgame"
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white focus:border-blue-500"
                    />
                  </View>

                  {/* Título Original */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">
                      Título Original
                    </Text>
                    <TextInput
                      value={formData.titulo_original}
                      onChangeText={(text) => setFormData({ ...formData, titulo_original: text })}
                      placeholder="Título en idioma original (opcional)"
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                    />
                  </View>

                  {/* Sinopsis */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">Sinopsis</Text>
                    <TextInput
                      value={formData.sinopsis}
                      onChangeText={(text) => setFormData({ ...formData, sinopsis: text })}
                      placeholder="Describe la trama de la película..."
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={500}
                    />
                    <Text className="mt-1 text-xs text-gray-500">
                      {(formData.sinopsis || '').length}/500 caracteres
                    </Text>
                  </View>
                </View>

                {/* Sección: Detalles Técnicos */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white"> Detalles Técnicos</Text>

                  {/* Duración y Clasificación */}
                  <View className="mb-4 flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">
                        Duración (min) *
                      </Text>
                      <TextInput
                        value={formData.duracion.toString()}
                        onChangeText={(text) => {
                          const duracion = text === '' ? 0 : parseInt(text) || 0;
                          setFormData({ ...formData, duracion });
                        }}
                        placeholder="120"
                        placeholderTextColor="#6B7280"
                        className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                        keyboardType="numeric"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">
                        Clasificación *
                      </Text>
                      <View className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-3">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className="flex-row space-x-2">
                            {clasificaciones.map((clasificacion) => (
                              <TouchableOpacity
                                key={clasificacion}
                                onPress={() => setFormData({ ...formData, clasificacion })}
                                className={`rounded-xl px-4 py-2 ${
                                  formData.clasificacion === clasificacion
                                    ? 'bg-blue-600'
                                    : 'bg-gray-700/50'
                                }`}>
                                <Text className="text-sm font-semibold text-white">
                                  {clasificacion}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  </View>

                  {/* Idioma y Subtítulos */}
                  <View className="mb-4 flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">
                        Idioma Original
                      </Text>
                      <TextInput
                        value={formData.idioma_original}
                        onChangeText={(text) => setFormData({ ...formData, idioma_original: text })}
                        placeholder="Español, Inglés, etc."
                        placeholderTextColor="#6B7280"
                        className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">Subtítulos</Text>
                      <TextInput
                        value={formData.subtitulos}
                        onChangeText={(text) => setFormData({ ...formData, subtitulos: text })}
                        placeholder="Español, Inglés"
                        placeholderTextColor="#6B7280"
                        className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      />
                    </View>
                  </View>
                </View>

                {/* Sección: Equipo Creativo */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white">🎬 Equipo Creativo</Text>

                  {/* Director */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">Director</Text>
                    <TextInput
                      value={formData.director}
                      onChangeText={(text) => setFormData({ ...formData, director: text })}
                      placeholder="Nombre del director"
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                    />
                  </View>

                  {/* Reparto */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">
                      Reparto Principal
                    </Text>
                    <TextInput
                      value={formData.reparto}
                      onChangeText={(text) => setFormData({ ...formData, reparto: text })}
                      placeholder="Actor 1, Actor 2, Actor 3..."
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Sección: Géneros */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white">🏷️ Géneros *</Text>
                  <View className="rounded-2xl border border-gray-700/50 bg-gray-800/30 p-4">
                    <View className="flex-row flex-wrap">
                      {generos.map((genero) => {
                        const isSelected = formData.generos_ids?.includes(genero.id) || false;
                        return (
                          <TouchableOpacity
                            key={genero.id}
                            onPress={() => {
                              const currentGeneros = formData.generos_ids || [];
                              const newGeneros = isSelected
                                ? currentGeneros.filter((id) => id !== genero.id)
                                : [...currentGeneros, genero.id];
                              setFormData({ ...formData, generos_ids: newGeneros });
                            }}
                            className={`mb-2 mr-2 rounded-full px-4 py-2 ${
                              isSelected
                                ? 'border border-blue-500 bg-blue-600'
                                : 'border border-gray-600 bg-gray-700/50'
                            }`}>
                            <Text
                              className={`text-sm font-medium ${
                                isSelected ? 'text-white' : 'text-gray-300'
                              }`}>
                              {genero.nombre}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {(!formData.generos_ids || formData.generos_ids.length === 0) && (
                      <Text className="mt-2 text-xs text-gray-500">
                        Selecciona al menos un género para la película
                      </Text>
                    )}
                  </View>
                </View>

                {/* Sección: Multimedia */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white">🖼️ Multimedia</Text>

                  {/* Poster URL */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">URL del Póster</Text>
                    <TextInput
                      value={formData.poster_url}
                      onChangeText={(text) => setFormData({ ...formData, poster_url: text })}
                      placeholder="https://ejemplo.com/poster.jpg"
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      keyboardType="url"
                    />
                  </View>

                  {/* Trailer URL */}
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-semibold text-gray-300">
                      URL del Tráiler
                    </Text>
                    <TextInput
                      value={formData.trailer_url}
                      onChangeText={(text) => setFormData({ ...formData, trailer_url: text })}
                      placeholder="https://youtube.com/watch?v=..."
                      placeholderTextColor="#6B7280"
                      className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      keyboardType="url"
                    />
                  </View>
                </View>

                {/* Sección: Fechas */}
                <View>
                  <Text className="mb-4 text-lg font-bold text-white">📅 Fechas de Exhibición</Text>

                  {/* Fechas */}
                  <View className="flex-row space-x-3">
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">
                        Fecha de Estreno
                      </Text>
                      <TextInput
                        value={formData.fecha_estreno}
                        onChangeText={(text) => setFormData({ ...formData, fecha_estreno: text })}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#6B7280"
                        className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="mb-2 text-sm font-semibold text-gray-300">
                        Fecha Fin Exhibición
                      </Text>
                      <TextInput
                        value={formData.fecha_fin_exhibicion}
                        onChangeText={(text) =>
                          setFormData({ ...formData, fecha_fin_exhibicion: text })
                        }
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#6B7280"
                        className="rounded-2xl border border-gray-700/50 bg-gray-800/50 px-4 py-4 text-white"
                      />
                    </View>
                  </View>
                  <Text className="mt-2 text-xs text-gray-500">
                    Formato: Año-Mes-Día (ej: 2024-12-25)
                  </Text>
                </View>

                {/* Información adicional para edición */}
                {editingPelicula && (
                  <View className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4">
                    <Text className="mb-3 text-sm font-bold text-yellow-400">
                      ℹ️ Información de la Película
                    </Text>
                    <View className="space-y-1">
                      <Text className="text-xs text-gray-300">ID: {editingPelicula.id}</Text>
                      <Text className="text-xs text-gray-300">
                        Estado: {editingPelicula.activa ? '✅ Activa' : '❌ Inactiva'}
                      </Text>
                      <Text className="text-xs text-gray-300">
                        Destacada: {editingPelicula.destacada ? '⭐ Sí' : '➖ No'}
                      </Text>
                      {editingPelicula.calificacion && (
                        <Text className="text-xs text-gray-300">
                          Calificación: ⭐ {editingPelicula.calificacion.toFixed(1)} (
                          {editingPelicula.votos} votos)
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mt-6 flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-xl border border-gray-600 bg-gray-700/50 px-4 py-4">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={
                  formLoading ||
                  !formData.titulo.trim() ||
                  formData.duracion <= 0 ||
                  !formData.generos_ids ||
                  formData.generos_ids.length === 0
                }
                className={`flex-1 rounded-xl px-4 py-4 ${
                  formLoading ||
                  !formData.titulo.trim() ||
                  formData.duracion <= 0 ||
                  !formData.generos_ids ||
                  formData.generos_ids.length === 0
                    ? 'bg-gray-600/50'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600'
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
