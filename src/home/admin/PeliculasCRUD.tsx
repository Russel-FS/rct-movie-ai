import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Star, 
  Clock, 
  Film, 
  X, 
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  Users,
  ChevronDown
} from 'lucide-react-native';
import { Pelicula, CreatePeliculaDto, UpdatePeliculaDto, Clasificacion } from '~/shared/types/pelicula';
import { GeneroMovie } from '~/shared/types/genero';
import { PeliculaService } from '../services/pelicula.service';
import { GeneroService } from '../services/genero.service';

// Opciones de clasificación con descripciones
const CLASIFICACIONES: { value: Clasificacion; label: string; description: string }[] = [
  { value: 'G', label: 'G - General', description: 'Apta para todas las edades' },
  { value: 'PG', label: 'PG - Parental Guidance', description: 'Se sugiere orientación parental' },
  { value: 'PG-13', label: 'PG-13 - Parental Guidance 13+', description: 'Mayores de 13 años' },
  { value: 'R', label: 'R - Restricted', description: 'Restringida - Mayores de 17 años' },
  { value: 'NC-17', label: 'NC-17 - No Children', description: 'Solo adultos - Mayores de 18 años' },
];

export default function PeliculasCRUD() {
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
    duracion: 0,
    clasificacion: 'PG' as Clasificacion,
  });
  const [selectedGeneros, setSelectedGeneros] = useState<number[]>([]);
  const [formLoading, setFormLoading] = useState(false);

  // Estado para el picker de clasificación
  const [showClasificacionPicker, setShowClasificacionPicker] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [peliculasData, generosData] = await Promise.all([
        showInactive ? PeliculaService.getAllPeliculas() : PeliculaService.getPeliculas(),
        GeneroService.getGeneros()
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
  const filteredPeliculas = peliculas.filter(pelicula =>
    pelicula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pelicula.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pelicula.titulo_original?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear duración
  const formatDuration = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };

  // Abrir modal para crear película
  const openCreateModal = () => {
    setEditingPelicula(null);
    setFormData({
      titulo: '',
      duracion: 0,
      clasificacion: 'PG' as Clasificacion,
    });
    setSelectedGeneros([]);
    setModalVisible(true);
  };

  // Abrir modal para editar película
  const openEditModal = async (pelicula: Pelicula) => {
    setEditingPelicula(pelicula);
    setFormData({
      titulo: pelicula.titulo,
      titulo_original: pelicula.titulo_original,
      sinopsis: pelicula.sinopsis,
      duracion: pelicula.duracion,
      clasificacion: pelicula.clasificacion,
      idioma_original: pelicula.idioma_original,
      subtitulos: pelicula.subtitulos,
      director: pelicula.director,
      reparto: pelicula.reparto,
      poster_url: pelicula.poster_url,
      trailer_url: pelicula.trailer_url,
      fecha_estreno: pelicula.fecha_estreno,
      fecha_fin_exhibicion: pelicula.fecha_fin_exhibicion,
    });
    
    // Cargar géneros de la película
    try {
      const generosPelicula = await PeliculaService.getGenerosPelicula(pelicula.id);
      setSelectedGeneros(generosPelicula);
    } catch (error) {
      setSelectedGeneros([]);
    }
    
    setModalVisible(true);
  };

  // Guardar película (crear o editar)
  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    try {
      setFormLoading(true);
      const peliculaData = {
        ...formData,
        generos_ids: selectedGeneros
      };

      if (editingPelicula) {
        await PeliculaService.modificarPelicula(editingPelicula.id, peliculaData as UpdatePeliculaDto);
      } else {
        await PeliculaService.agregarPelicula(peliculaData);
      }

      setModalVisible(false);
      loadData();
      Alert.alert('Éxito', `Película ${editingPelicula ? 'actualizada' : 'creada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', `No se pudo ${editingPelicula ? 'actualizar' : 'crear'} la película`);
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de película
  const togglePeliculaStatus = async (pelicula: Pelicula) => {
    try {
      await PeliculaService.actualizarEstadoPelicula(pelicula.id, !pelicula.activa);
      loadData();
      Alert.alert('Éxito', `Película ${!pelicula.activa ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la película');
    }
  };

  // Cambiar estado destacado
  const toggleDestacado = async (pelicula: Pelicula) => {
    try {
      await PeliculaService.actualizarDestacado(pelicula.id, !pelicula.destacada);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado destacado');
    }
  };

  // Toggle género seleccionado
  const toggleGenero = (generoId: number) => {
    setSelectedGeneros(prev => 
      prev.includes(generoId) 
        ? prev.filter(id => id !== generoId)
        : [...prev, generoId]
    );
  };

  // Seleccionar clasificación
  const selectClasificacion = (clasificacion: Clasificacion) => {
    setFormData({ ...formData, clasificacion });
    setShowClasificacionPicker(false);
  };

  // Obtener descripción de clasificación
  const getClasificacionInfo = (clasificacion: Clasificacion) => {
    return CLASIFICACIONES.find(c => c.value === clasificacion);
  };

  // Componente de tarjeta de película
  const PeliculaCard = ({ pelicula }: { pelicula: Pelicula }) => (
    <View className="mx-2 mb-4 rounded-lg bg-gray-800 p-4">
      <View className="mb-3 flex-row">
        <Image
          source={{
            uri: pelicula.poster_url || 'https://via.placeholder.com/300x450?text=Sin+Imagen',
          }}
          className="h-32 w-24 rounded-lg"
          resizeMode="cover"
        />
        
        <View className="ml-3 flex-1">
          <Text className="mb-1 text-lg font-bold text-white" numberOfLines={2}>
            {pelicula.titulo}
          </Text>
          
          {pelicula.titulo_original && (
            <Text className="mb-2 text-sm text-gray-400" numberOfLines={1}>
              {pelicula.titulo_original}
            </Text>
          )}
          
          <View className="mb-2 flex-row items-center">
            <Film size={12} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-gray-400">{pelicula.clasificacion}</Text>
            <Clock size={12} color="#9CA3AF" className="ml-3" />
            <Text className="ml-1 text-xs text-gray-400">{formatDuration(pelicula.duracion)}</Text>
          </View>
          
          {pelicula.director && (
            <Text className="mb-1 text-xs text-gray-400">Dir: {pelicula.director}</Text>
          )}
          
          <View className="flex-row items-center">
            <Star size={12} color="#EAB308" fill="#EAB308" />
            <Text className="ml-1 text-xs text-white">
              {pelicula.calificacion?.toFixed(1) || 'N/A'}
            </Text>
            <Users size={12} color="#9CA3AF" className="ml-3" />
            <Text className="ml-1 text-xs text-gray-400">{pelicula.votos}</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
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
      </View>

      {/* Botones de acción */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => openEditModal(pelicula)}
          className="flex-1 mr-2 flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-2">
          <Edit size={16} color="#ffffff" />
          <Text className="ml-2 font-bold text-white">Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => toggleDestacado(pelicula)}
          className={`mr-2 flex-row items-center justify-center rounded-lg px-4 py-2 ${
            pelicula.destacada ? 'bg-yellow-600' : 'bg-gray-600'
          }`}>
          <Star size={16} color="#ffffff" fill={pelicula.destacada ? '#ffffff' : 'transparent'} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => togglePeliculaStatus(pelicula)}
          className={`flex-row items-center justify-center rounded-lg px-4 py-2 ${
            pelicula.activa ? 'bg-red-600' : 'bg-green-600'
          }`}>
          {pelicula.activa ? (
            <>
              <EyeOff size={16} color="#ffffff" />
              <Text className="ml-2 font-bold text-white">Desactivar</Text>
            </>
          ) : (
            <>
              <Eye size={16} color="#ffffff" />
              <Text className="ml-2 font-bold text-white">Activar</Text>
            </>
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
      <View className="px-4 pb-4 pt-14">
        <Text className="mb-1 text-sm text-gray-400">Administración</Text>
        <Text className="mb-4 text-2xl font-bold text-white">Gestión de Películas</Text>
        
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

        {/* Barra de búsqueda y botón crear */}
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
            <Text className="mb-2 text-lg text-gray-400">No se encontraron películas</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay películas disponibles'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-gray-900 px-6 py-6" style={{ maxHeight: '90%' }}>
            {/* Header del modal */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingPelicula ? 'Editar Película' : 'Nueva Película'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Formulario */}
              <View className="space-y-4">
                {/* Título */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Título *</Text>
                  <TextInput
                    value={formData.titulo}
                    onChangeText={(text) => setFormData({ ...formData, titulo: text })}
                    placeholder="Ingresa el título"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  />
                </View>

                {/* Título original */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Título Original</Text>
                  <TextInput
                    value={formData.titulo_original || ''}
                    onChangeText={(text) => setFormData({ ...formData, titulo_original: text })}
                    placeholder="Título en idioma original"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  />
                </View>

                {/* Sinopsis */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Sinopsis</Text>
                  <TextInput
                    value={formData.sinopsis || ''}
                    onChangeText={(text) => setFormData({ ...formData, sinopsis: text })}
                    placeholder="Descripción de la película"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Duración y Clasificación */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Duración (min) *</Text>
                    <TextInput
                      value={formData.duracion?.toString() || ''}
                      onChangeText={(text) => setFormData({ ...formData, duracion: parseInt(text) || 0 })}
                      placeholder="120"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Clasificación *</Text>
                    <TouchableOpacity
                      onPress={() => setShowClasificacionPicker(true)}
                      className="flex-row items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
                      <View>
                        <Text className="text-white font-bold">
                          {getClasificacionInfo(formData.clasificacion)?.label || formData.clasificacion}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          {getClasificacionInfo(formData.clasificacion)?.description}
                        </Text>
                      </View>
                      <ChevronDown size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Director */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Director</Text>
                  <TextInput
                    value={formData.director || ''}
                    onChangeText={(text) => setFormData({ ...formData, director: text })}
                    placeholder="Nombre del director"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  />
                </View>

                {/* URLs */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">URL del Poster</Text>
                  <TextInput
                    value={formData.poster_url || ''}
                    onChangeText={(text) => setFormData({ ...formData, poster_url: text })}
                    placeholder="https://..."
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  />
                </View>

                {/* Géneros */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Géneros</Text>
                  <View className="flex-row flex-wrap">
                    {generos.map((genero) => (
                      <TouchableOpacity
                        key={genero.id}
                        onPress={() => toggleGenero(genero.id)}
                        className={`mb-2 mr-2 rounded-lg px-3 py-2 ${
                          selectedGeneros.includes(genero.id) ? 'bg-blue-600' : 'bg-gray-700'
                        }`}>
                        <Text className="text-sm font-bold text-white">{genero.nombre}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Botones */}
              <View className="mt-6 flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="flex-1 rounded-lg bg-gray-600 px-4 py-3">
                  <Text className="text-center font-bold text-white">Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-3">
                  {formLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <View className="flex-row items-center justify-center">
                      <Save size={16} color="#ffffff" />
                      <Text className="ml-2 font-bold text-white">Guardar</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal del Picker de Clasificación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showClasificacionPicker}
        onRequestClose={() => setShowClasificacionPicker(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-gray-900 px-6 py-6">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">Seleccionar Clasificación</Text>
              <TouchableOpacity onPress={() => setShowClasificacionPicker(false)}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Lista de clasificaciones */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {CLASIFICACIONES.map((clasificacion) => (
                <TouchableOpacity
                  key={clasificacion.value}
                  onPress={() => selectClasificacion(clasificacion.value)}
                  className={`mb-3 rounded-lg p-4 ${
                    formData.clasificacion === clasificacion.value ? 'bg-blue-600' : 'bg-gray-800'
                  }`}>
                  <Text className="mb-1 text-lg font-bold text-white">
                    {clasificacion.label}
                  </Text>
                  <Text className="text-sm text-gray-300">
                    {clasificacion.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}