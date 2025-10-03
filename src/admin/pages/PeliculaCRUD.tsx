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

  // Componente de tarjeta de película
  const PeliculaCard = ({ pelicula }: { pelicula: Pelicula }) => (
    <View className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
      <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} className="p-5">
        <View className="mb-4 flex-row items-start">
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
            <Film size={24} color="#3B82F6" />
          </View>

          <View className="flex-1">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 text-lg font-semibold text-white" numberOfLines={1}>
                {pelicula.titulo}
              </Text>
              <View className="ml-3 rounded-full bg-white/10 px-3 py-1">
                <Text className="text-xs font-medium text-white/70">#{pelicula.id}</Text>
              </View>
            </View>

            {pelicula.director && (
              <View className="mb-2 flex-row items-center">
                <User size={14} color="#9CA3AF" />
                <Text className="ml-2 text-sm text-gray-300">{pelicula.director}</Text>
              </View>
            )}

            <View className="mb-3 flex-row items-center">
              <Clock size={14} color="#9CA3AF" />
              <Text className="ml-2 text-sm text-gray-300">{pelicula.duracion} min</Text>
              <View className="ml-4 rounded-lg bg-white/10 px-3 py-1">
                <Text className="text-xs font-semibold text-white">{pelicula.clasificacion}</Text>
              </View>
            </View>

            {pelicula.sinopsis && (
              <Text className="text-sm leading-5 text-gray-300" numberOfLines={2}>
                {pelicula.sinopsis}
              </Text>
            )}
          </View>
        </View>

        {/* Badges de estado */}
        <View className="mb-4 flex-row flex-wrap">
          {!pelicula.activa && (
            <View className="mb-2 mr-2 rounded-full bg-red-500/20 px-3 py-1">
              <Text className="text-xs font-semibold text-red-400">Inactiva</Text>
            </View>
          )}
          {pelicula.destacada && (
            <View className="mb-2 mr-2 flex-row items-center rounded-full bg-yellow-500/20 px-3 py-1">
              <Sparkles size={12} color="#F59E0B" />
              <Text className="ml-1 text-xs font-semibold text-yellow-400">Destacada</Text>
            </View>
          )}
          {pelicula.calificacion && (
            <View className="mb-2 mr-2 flex-row items-center rounded-full bg-green-500/20 px-3 py-1">
              <Star size={12} color="#10B981" fill="#10B981" />
              <Text className="ml-1 text-xs font-semibold text-green-400">
                {pelicula.calificacion.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Botones de acción   */}
        <View className="flex-row space-x-3">
          <Pressable
            onPress={() => openEditModal(pelicula)}
            className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-500/20 py-3 active:bg-blue-500/30">
            <Edit3 size={16} color="#3B82F6" />
            <Text className="ml-2 text-sm font-semibold text-blue-400">Editar</Text>
          </Pressable>

          <Pressable
            onPress={() => toggleDestacada(pelicula)}
            className={`flex-row items-center justify-center rounded-xl px-4 py-3 ${
              pelicula.destacada
                ? 'bg-yellow-500/20 active:bg-yellow-500/30'
                : 'bg-white/10 active:bg-white/20'
            }`}>
            <Star
              size={16}
              color={pelicula.destacada ? '#F59E0B' : '#9CA3AF'}
              fill={pelicula.destacada ? '#F59E0B' : 'none'}
            />
          </Pressable>

          <Pressable
            onPress={() => togglePeliculaStatus(pelicula)}
            className={`flex-row items-center justify-center rounded-xl px-4 py-3 ${
              pelicula.activa
                ? 'bg-red-500/20 active:bg-red-500/30'
                : 'bg-green-500/20 active:bg-green-500/30'
            }`}>
            {pelicula.activa ? (
              <EyeOff size={16} color="#EF4444" />
            ) : (
              <Eye size={16} color="#10B981" />
            )}
          </Pressable>
        </View>
      </LinearGradient>
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
      {/* Header   */}
      <LinearGradient colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.7)']} className="px-4 pb-6 pt-4">
        {/* Título principal */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">Gestión de Películas</Text>
          <Text className="mt-1 text-sm text-gray-400">
            {filteredPeliculas.length} película{filteredPeliculas.length !== 1 ? 's' : ''}{' '}
            encontrada{filteredPeliculas.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Controles superiores */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="mr-3 text-sm font-medium text-gray-300">Mostrar inactivas</Text>
            <Switch
              value={showInactive}
              onValueChange={setShowInactive}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#3B82F6' }}
              thumbColor="#ffffff"
              ios_backgroundColor="rgba(255,255,255,0.1)"
            />
          </View>
        </View>

        {/* Barra de búsqueda y botones   */}
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-xl">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar por título, director o sinopsis..."
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 text-white"
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
            />
          </View>

          <Pressable
            onPress={openCreateModal}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 active:bg-green-500/30">
            <Plus size={22} color="#10B981" />
          </Pressable>

          <Pressable
            onPress={loadData}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 active:bg-blue-500/30">
            <RotateCcw size={20} color="#3B82F6" />
          </Pressable>
        </View>
      </LinearGradient>

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
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-white/5">
              <Film size={48} color="#6B7280" />
            </View>
            <Text className="mb-2 text-xl font-semibold text-white">
              No se encontraron películas
            </Text>
            <Text className="px-8 text-center text-sm leading-5 text-gray-400">
              {searchTerm
                ? 'Intenta con otro término de búsqueda o ajusta los filtros'
                : 'Comienza agregando tu primera película al catálogo'}
            </Text>
            {!searchTerm && (
              <Pressable
                onPress={openCreateModal}
                className="mt-6 flex-row items-center rounded-2xl bg-green-500/20 px-6 py-3 active:bg-green-500/30">
                <Plus size={20} color="#10B981" />
                <Text className="ml-2 font-semibold text-green-400">Agregar Película</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario   */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/60 backdrop-blur-sm">
          <View className="mt-16 flex-1 overflow-hidden rounded-t-3xl bg-gray-900">
            <LinearGradient colors={['rgba(17,24,39,0.95)', 'rgba(17,24,39,1)']} className="flex-1">
              {/* Header del modal   */}
              <View className="border-b border-white/10 px-6 py-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-xl font-bold text-white">
                      {editingPelicula ? 'Editar Película' : 'Nueva Película'}
                    </Text>
                    <Text className="mt-1 text-sm text-gray-400">
                      {editingPelicula
                        ? 'Modifica los detalles de la película'
                        : 'Completa la información de la nueva película'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
                    <X size={20} color="#ffffff" />
                  </Pressable>
                </View>
              </View>

              {/* Formulario en ScrollView */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}>
                {/* Sección: Información Básica */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                      <Film size={16} color="#3B82F6" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Información Básica</Text>
                  </View>

                  {/* Título */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">Título *</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.titulo}
                        onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                        placeholder="Ej: Avengers: Endgame"
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        style={{ fontSize: 16 }}
                      />
                    </View>
                  </View>

                  {/* Título Original */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">Título Original</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.titulo_original}
                        onChangeText={(text) => setFormData({ ...formData, titulo_original: text })}
                        placeholder="Título en idioma original (opcional)"
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        style={{ fontSize: 16 }}
                      />
                    </View>
                  </View>

                  {/* Sinopsis */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">Sinopsis</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.sinopsis}
                        onChangeText={(text) => setFormData({ ...formData, sinopsis: text })}
                        placeholder="Describe la trama de la película..."
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={500}
                        style={{ fontSize: 16, minHeight: 100 }}
                      />
                    </View>
                    <Text className="mt-2 text-xs text-gray-500">
                      {(formData.sinopsis || '').length}/500 caracteres
                    </Text>
                  </View>
                </View>

                {/* Sección: Detalles Técnicos */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                      <Clock size={16} color="#8B5CF6" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Detalles Técnicos</Text>
                  </View>

                  {/* Duración y Clasificación */}
                  <View className="mb-5 flex-row space-x-4">
                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">
                        Duración (min) *
                      </Text>
                      <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                        <TextInput
                          value={formData.duracion.toString()}
                          onChangeText={(text) => {
                            const duracion = text === '' ? 0 : parseInt(text) || 0;
                            setFormData({ ...formData, duracion });
                          }}
                          placeholder="120"
                          placeholderTextColor="#6B7280"
                          className="px-4 py-4 text-white"
                          keyboardType="numeric"
                          style={{ fontSize: 16 }}
                        />
                      </View>
                    </View>

                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">
                        Clasificación *
                      </Text>
                      <Pressable
                        onPress={() => setShowClassificationSelector(!showClassificationSelector)}
                        className="flex-row items-center justify-between rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-xl">
                        <Text className="text-white" style={{ fontSize: 16 }}>
                          {formData.clasificacion}
                        </Text>
                        <ChevronDown size={20} color="#9CA3AF" />
                      </Pressable>

                      {showClassificationSelector && (
                        <View className="mt-2 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl">
                          {clasificaciones.map((clasificacion) => (
                            <Pressable
                              key={clasificacion}
                              onPress={() => {
                                setFormData({ ...formData, clasificacion });
                                setShowClassificationSelector(false);
                              }}
                              className="flex-row items-center justify-between px-4 py-3 active:bg-white/10">
                              <Text className="text-white" style={{ fontSize: 16 }}>
                                {clasificacion}
                              </Text>
                              {formData.clasificacion === clasificacion && (
                                <Check size={16} color="#3B82F6" />
                              )}
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Idioma y Subtítulos */}
                  <View className="flex-row space-x-4">
                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">
                        Idioma Original
                      </Text>
                      <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                        <TextInput
                          value={formData.idioma_original}
                          onChangeText={(text) =>
                            setFormData({ ...formData, idioma_original: text })
                          }
                          placeholder="Español, Inglés, etc."
                          placeholderTextColor="#6B7280"
                          className="px-4 py-4 text-white"
                          style={{ fontSize: 16 }}
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">Subtítulos</Text>
                      <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                        <TextInput
                          value={formData.subtitulos}
                          onChangeText={(text) => setFormData({ ...formData, subtitulos: text })}
                          placeholder="Español, Inglés"
                          placeholderTextColor="#6B7280"
                          className="px-4 py-4 text-white"
                          style={{ fontSize: 16 }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Sección: Equipo Creativo */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                      <User size={16} color="#F97316" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Equipo Creativo</Text>
                  </View>

                  {/* Director */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">Director</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.director}
                        onChangeText={(text) => setFormData({ ...formData, director: text })}
                        placeholder="Nombre del director"
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        style={{ fontSize: 16 }}
                      />
                    </View>
                  </View>

                  {/* Reparto */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">
                      Reparto Principal
                    </Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.reparto}
                        onChangeText={(text) => setFormData({ ...formData, reparto: text })}
                        placeholder="Actor 1, Actor 2, Actor 3..."
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        multiline
                        numberOfLines={2}
                        textAlignVertical="top"
                        style={{ fontSize: 16, minHeight: 80 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Sección: Géneros */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <Tag size={16} color="#10B981" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Géneros *</Text>
                  </View>

                  <View className="overflow-hidden rounded-2xl bg-white/5 p-4 backdrop-blur-xl">
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
                            className={`mb-3 mr-3 rounded-full px-4 py-2 ${
                              isSelected
                                ? 'border border-blue-500/50 bg-blue-500/30'
                                : 'border border-white/20 bg-white/10'
                            }`}>
                            <Text
                              className={`text-sm font-medium ${
                                isSelected ? 'text-blue-400' : 'text-gray-300'
                              }`}>
                              {genero.nombre}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    {(!formData.generos_ids || formData.generos_ids.length === 0) && (
                      <View className="mt-2 flex-row items-center">
                        <Info size={14} color="#F59E0B" />
                        <Text className="ml-2 text-xs text-yellow-400">
                          Selecciona al menos un género para la película
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Sección: Multimedia */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-pink-500/20">
                      <ImageIcon size={16} color="#EC4899" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Multimedia</Text>
                  </View>

                  {/* Poster URL */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">URL del Póster</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.poster_url}
                        onChangeText={(text) => setFormData({ ...formData, poster_url: text })}
                        placeholder="https://ejemplo.com/poster.jpg"
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        keyboardType="url"
                        style={{ fontSize: 16 }}
                      />
                    </View>
                  </View>

                  {/* Trailer URL */}
                  <View className="mb-5">
                    <Text className="mb-3 text-sm font-medium text-gray-300">URL del Tráiler</Text>
                    <View className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl">
                      <TextInput
                        value={formData.trailer_url}
                        onChangeText={(text) => setFormData({ ...formData, trailer_url: text })}
                        placeholder="https://youtube.com/watch?v=..."
                        placeholderTextColor="#6B7280"
                        className="px-4 py-4 text-white"
                        keyboardType="url"
                        style={{ fontSize: 16 }}
                      />
                    </View>
                  </View>
                </View>

                {/* Sección: Fechas */}
                <View className="mb-8">
                  <View className="mb-6 flex-row items-center">
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                      <CalendarDays size={16} color="#6366F1" />
                    </View>
                    <Text className="text-lg font-semibold text-white">Fechas de Exhibición</Text>
                  </View>

                  {/* Fechas */}
                  <View className="flex-row space-x-4">
                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">
                        Fecha de Estreno
                      </Text>
                      <Pressable
                        onPress={() => setShowDatePicker('estreno')}
                        className="flex-row items-center justify-between rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-xl">
                        <Text className="text-white" style={{ fontSize: 16 }}>
                          {formData.fecha_estreno
                            ? formatDateForDisplay(formData.fecha_estreno)
                            : 'Seleccionar fecha'}
                        </Text>
                        <Calendar size={20} color="#9CA3AF" />
                      </Pressable>
                    </View>

                    <View className="flex-1">
                      <Text className="mb-3 text-sm font-medium text-gray-300">
                        Fecha Fin Exhibición
                      </Text>
                      <Pressable
                        onPress={() => setShowDatePicker('fin')}
                        className="flex-row items-center justify-between rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-xl">
                        <Text className="text-white" style={{ fontSize: 16 }}>
                          {formData.fecha_fin_exhibicion
                            ? formatDateForDisplay(formData.fecha_fin_exhibicion)
                            : 'Seleccionar fecha'}
                        </Text>
                        <Calendar size={20} color="#9CA3AF" />
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Información adicional para edición */}
                {editingPelicula && (
                  <View className="overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-5 backdrop-blur-xl">
                    <View className="mb-4 flex-row items-center">
                      <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                        <Info size={16} color="#F59E0B" />
                      </View>
                      <Text className="text-lg font-semibold text-yellow-400">
                        Información de la Película
                      </Text>
                    </View>
                    <View className="space-y-3">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-gray-300">ID</Text>
                        <Text className="text-sm font-medium text-white">
                          #{editingPelicula.id}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-gray-300">Estado</Text>
                        <View
                          className={`rounded-full px-3 py-1 ${editingPelicula.activa ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <Text
                            className={`text-xs font-semibold ${editingPelicula.activa ? 'text-green-400' : 'text-red-400'}`}>
                            {editingPelicula.activa ? 'Activa' : 'Inactiva'}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-gray-300">Destacada</Text>
                        <View
                          className={`rounded-full px-3 py-1 ${editingPelicula.destacada ? 'bg-yellow-500/20' : 'bg-gray-500/20'}`}>
                          <Text
                            className={`text-xs font-semibold ${editingPelicula.destacada ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {editingPelicula.destacada ? 'Sí' : 'No'}
                          </Text>
                        </View>
                      </View>
                      {editingPelicula.calificacion && (
                        <View className="flex-row items-center justify-between">
                          <Text className="text-sm text-gray-300">Calificación</Text>
                          <View className="flex-row items-center rounded-full bg-green-500/20 px-3 py-1">
                            <Star size={12} color="#10B981" fill="#10B981" />
                            <Text className="ml-1 text-xs font-semibold text-green-400">
                              {editingPelicula.calificacion.toFixed(1)} ({editingPelicula.votos}{' '}
                              votos)
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Botones   */}
              <View className="border-t border-white/10 px-6 py-4">
                <View className="flex-row space-x-4">
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    className="flex-1 rounded-2xl bg-white/10 py-4 active:bg-white/20">
                    <Text className="text-center text-lg font-semibold text-white">Cancelar</Text>
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
                    className={`flex-1 rounded-2xl py-4 ${
                      formLoading ||
                      !formData.titulo.trim() ||
                      formData.duracion <= 0 ||
                      !formData.generos_ids ||
                      formData.generos_ids.length === 0
                        ? 'bg-gray-600/30'
                        : 'bg-blue-500 active:bg-blue-600'
                    }`}>
                    {formLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Save size={18} color="#ffffff" />
                        <Text className="ml-2 text-lg font-semibold text-white">
                          {editingPelicula ? 'Actualizar' : 'Crear'}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Modal de Calendario */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker !== null}
        onRequestClose={() => setShowDatePicker(null)}>
        <View className="flex-1 items-center justify-center bg-black/60 backdrop-blur-sm">
          <View className="mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-gray-900">
            <LinearGradient colors={['rgba(17,24,39,0.95)', 'rgba(17,24,39,1)']} className="p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-white">
                  {showDatePicker === 'estreno' ? 'Fecha de Estreno' : 'Fecha Fin Exhibición'}
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(null)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
                  <X size={16} color="#ffffff" />
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
                    [formData.fecha_estreno]: { selected: true, selectedColor: '#3B82F6' },
                  }),
                  ...(formData.fecha_fin_exhibicion && {
                    [formData.fecha_fin_exhibicion]: { selected: true, selectedColor: '#10B981' },
                  }),
                }}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: '#9CA3AF',
                  selectedDayBackgroundColor: '#3B82F6',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#3B82F6',
                  dayTextColor: '#ffffff',
                  textDisabledColor: '#4B5563',
                  dotColor: '#3B82F6',
                  selectedDotColor: '#ffffff',
                  arrowColor: '#3B82F6',
                  monthTextColor: '#ffffff',
                  indicatorColor: '#3B82F6',
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
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}
