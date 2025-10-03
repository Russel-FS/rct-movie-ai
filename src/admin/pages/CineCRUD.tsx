import { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  Switch,
  Pressable,
} from 'react-native';
import {
  Plus,
  Search,
  X,
  Save,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Navigation,
} from 'lucide-react-native';

import { Cine, CreateCineDto, UpdateCineDto } from '~/shared/types/cine';
import { CineService } from '~/shared/services/cine.service';
import { useLocation } from '~/shared/hooks/useLocation';

// Distritos de Lima con sus coordenadas
const distritosLima = [
  {
    nombre: 'Miraflores',
    lat: -12.121111,
    lng: -77.029722,
    color: 'bg-blue-500/20',
    textColor: 'text-blue-400',
  },
  {
    nombre: 'San Isidro',
    lat: -12.103889,
    lng: -77.035556,
    color: 'bg-green-500/20',
    textColor: 'text-green-400',
  },
  {
    nombre: 'Barranco',
    lat: -12.140833,
    lng: -77.020556,
    color: 'bg-purple-500/20',
    textColor: 'text-purple-400',
  },
  {
    nombre: 'Surco',
    lat: -12.135278,
    lng: -76.987222,
    color: 'bg-orange-500/20',
    textColor: 'text-orange-400',
  },
  {
    nombre: 'La Molina',
    lat: -12.076667,
    lng: -76.941667,
    color: 'bg-pink-500/20',
    textColor: 'text-pink-400',
  },
  {
    nombre: 'San Borja',
    lat: -12.108333,
    lng: -77.001667,
    color: 'bg-indigo-500/20',
    textColor: 'text-indigo-400',
  },
  {
    nombre: 'Jesús María',
    lat: -12.073889,
    lng: -77.048611,
    color: 'bg-teal-500/20',
    textColor: 'text-teal-400',
  },
  {
    nombre: 'Lince',
    lat: -12.088889,
    lng: -77.038889,
    color: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
  },
  {
    nombre: 'Magdalena',
    lat: -12.096111,
    lng: -77.075556,
    color: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
  },
  {
    nombre: 'Pueblo Libre',
    lat: -12.075556,
    lng: -77.063889,
    color: 'bg-lime-500/20',
    textColor: 'text-lime-400',
  },
  {
    nombre: 'Breña',
    lat: -12.058333,
    lng: -77.051667,
    color: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
  },
  {
    nombre: 'Lima Centro',
    lat: -12.046374,
    lng: -77.042793,
    color: 'bg-red-500/20',
    textColor: 'text-red-400',
  },
];

export default function CineCRUD() {
  // Hook de ubicación
  const { location, requestLocation, hasPermission } = useLocation();

  // Estados principales
  const [cines, setCines] = useState<Cine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCine, setEditingCine] = useState<Cine | null>(null);
  const [formData, setFormData] = useState<CreateCineDto>({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    latitud: undefined,
    longitud: undefined,
    horario_apertura: '',
    horario_cierre: '',
    imagen_url: '',
    descripcion: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive]);

  // Solicitar ubicación al montar el componente
  useEffect(() => {
    if (!hasPermission) {
      requestLocation();
    }
  }, []);

  // Recargar datos cuando cambie la ubicación
  useEffect(() => {
    if (location) {
      loadData();
    }
  }, [location]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userLat = location?.lat;
      const userLon = location?.lon;

      const cinesData = await CineService.getCines(userLat, userLon);
      const filteredCines = showInactive ? cinesData : cinesData.filter((c) => c.activo);
      setCines(filteredCines);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los cines');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cines por búsqueda
  const filteredCines = cines.filter(
    (cine) =>
      cine.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cine.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear cine
  const openCreateModal = () => {
    setEditingCine(null);
    setFormData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      latitud: undefined,
      longitud: undefined,
      horario_apertura: '',
      horario_cierre: '',
      imagen_url: '',
      descripcion: '',
    });
    setModalVisible(true);
  };

  // Abrir modal para editar cine
  const openEditModal = (cine: Cine) => {
    setEditingCine(cine);
    setFormData({
      nombre: cine.nombre,
      direccion: cine.direccion,
      telefono: cine.telefono || '',
      email: cine.email || '',
      latitud: cine.latitud,
      longitud: cine.longitud,
      horario_apertura: cine.horario_apertura || '',
      horario_cierre: cine.horario_cierre || '',
      imagen_url: cine.imagen_url || '',
      descripcion: cine.descripcion || '',
    });
    setModalVisible(true);
  };

  // Guardar cine
  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!formData.direccion.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return;
    }

    try {
      setFormLoading(true);

      if (editingCine) {
        await CineService.updateCine(editingCine.id, formData as UpdateCineDto);
        Alert.alert('Éxito', 'Cine actualizado correctamente');
      } else {
        await CineService.createCine(formData);
        Alert.alert('Éxito', 'Cine creado correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingCine ? 'actualizar' : 'crear'} el cine`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de cine
  const toggleCineStatus = async (cine: Cine) => {
    try {
      if (cine.activo) {
        await CineService.deleteCine(cine.id);
      } else {
        await CineService.updateCine(cine.id, { activo: true });
      }
      loadData();
      Alert.alert('Éxito', `Cine ${!cine.activo ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del cine');
    }
  };

  // Función para seleccionar distrito
  const selectDistrito = (distrito: any) => {
    setFormData({
      ...formData,
      latitud: distrito.lat,
      longitud: distrito.lng,
    });
    setShowMapSelector(false);
  };

  // Componente de tarjeta de cine estilo Perfil
  const CineCard = ({ cine }: { cine: Cine }) => (
    <Pressable
      className="mx-4 mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      onPress={() => openEditModal(cine)}
      style={{ opacity: 1 }}>
      <View className="p-6">
        <View className="flex-row items-start">
          <View className="mr-4 rounded-full bg-gray-700/50 p-3">
            <MapPin size={20} color="#9CA3AF" />
          </View>

          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
                {cine.nombre}
              </Text>
              <View className="flex-row items-center space-x-2">
                {cine.distance && (
                  <View className="rounded-full bg-blue-500/10 px-2 py-1">
                    <Text className="text-xs font-medium text-blue-400">{cine.distance}</Text>
                  </View>
                )}
                <Text className="text-xs text-gray-400">ID: {cine.id}</Text>
              </View>
            </View>

            <Text className="mb-2 text-sm text-gray-400" numberOfLines={2}>
              {cine.direccion}
            </Text>

            <View className="mb-3 space-y-1">
              {cine.telefono && (
                <View className="flex-row items-center">
                  <Phone size={12} color="#6B7280" />
                  <Text className="ml-2 text-xs text-gray-500">{cine.telefono}</Text>
                </View>
              )}

              {cine.email && (
                <View className="flex-row items-center">
                  <Mail size={12} color="#6B7280" />
                  <Text className="ml-2 text-xs text-gray-500">{cine.email}</Text>
                </View>
              )}

              {cine.horario_apertura && cine.horario_cierre && (
                <View className="flex-row items-center">
                  <Clock size={12} color="#6B7280" />
                  <Text className="ml-2 text-xs text-gray-500">
                    {cine.horario_apertura} - {cine.horario_cierre}
                  </Text>
                </View>
              )}
            </View>

            {/* Badge de estado y botón de toggle */}
            <View className="flex-row items-center justify-between">
              {!cine.activo && (
                <View className="rounded-full bg-red-500/10 px-3 py-1">
                  <Text className="text-xs font-medium text-red-400">Inactivo</Text>
                </View>
              )}

              <View className="flex-1" />

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleCineStatus(cine);
                }}
                className={`rounded-full px-4 py-2 ${
                  cine.activo ? 'bg-red-500/10' : 'bg-green-500/10'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    cine.activo ? 'text-red-400' : 'text-green-400'
                  }`}>
                  {cine.activo ? 'Desactivar' : 'Activar'}
                </Text>
              </Pressable>
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
        <Text className="mt-4 text-white">Cargando cines...</Text>
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
            <Text className="text-2xl font-bold text-white">Cines</Text>
          </View>
          <View className="flex-row space-x-2">
            <Pressable onPress={requestLocation} className="rounded-full bg-gray-800/50 p-3">
              <Navigation size={20} color="#9CA3AF" />
            </Pressable>
            <Pressable onPress={loadData} className="rounded-full bg-gray-800/50 p-3">
              <RotateCcw size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Stats y controles */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-gray-400">
              {filteredCines.length} cine{filteredCines.length !== 1 ? 's' : ''} encontrado
              {filteredCines.length !== 1 ? 's' : ''}
            </Text>
            {location && (
              <Text className="text-xs text-gray-500">
                📍 Ubicación: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </Text>
            )}
          </View>
          <View className="flex-row items-center">
            <Text className="mr-3 text-sm font-medium text-gray-400">Mostrar inactivos</Text>
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
              placeholder="Buscar cines..."
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

      {/* Lista de cines */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredCines.length > 0 ? (
          filteredCines.map((cine) => <CineCard key={cine.id} cine={cine} />)
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <MapPin size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron cines</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay cines disponibles'}
            </Text>
            {!searchTerm && (
              <Pressable
                onPress={openCreateModal}
                className="mt-6 overflow-hidden rounded-3xl bg-gray-800/50 px-6 py-3">
                <View className="flex-row items-center">
                  <Plus size={20} color="#9CA3AF" />
                  <Text className="ml-2 font-medium text-white">Agregar Cine</Text>
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
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[90%] rounded-t-3xl bg-black px-6 py-6">
            {/* Header del modal */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingCine ? 'Editar Cine' : 'Nuevo Cine'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-gray-800/50 p-2">
                <X size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* Formulario */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="space-y-4">
                {/* Información Básica */}
                <Text className="mb-4 text-lg font-bold text-white">Información Básica</Text>

                {/* Nombre */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.nombre}
                      onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                      placeholder="Nombre del cine"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Dirección */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Dirección *</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.direccion}
                      onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                      placeholder="Dirección completa"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Ubicación en Mapa */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Ubicación en Mapa</Text>
                  <Pressable
                    onPress={() => setShowMapSelector(true)}
                    className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                    <View className="flex-row items-center">
                      <Navigation size={16} color="#9CA3AF" />
                      <Text className="ml-2 text-white">
                        {formData.latitud && formData.longitud
                          ? `${formData.latitud.toFixed(6)}, ${formData.longitud.toFixed(6)}`
                          : 'Seleccionar en mapa'}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#9CA3AF" />
                  </Pressable>
                  <Text className="mt-1 text-xs text-gray-400">
                    Toca para seleccionar la ubicación exacta en el mapa
                  </Text>
                </View>

                {/* Contacto */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">
                  Información de Contacto
                </Text>

                {/* Teléfono y Email */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Teléfono</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.telefono}
                        onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                        placeholder="+51 999 999 999"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Email</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="cine@ejemplo.com"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="email-address"
                      />
                    </View>
                  </View>
                </View>

                {/* Horarios de Operación */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">
                  Horarios de Operación
                </Text>

                {/* Horarios */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Apertura</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.horario_apertura}
                        onChangeText={(text) =>
                          setFormData({ ...formData, horario_apertura: text })
                        }
                        placeholder="09:00"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Cierre</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.horario_cierre}
                        onChangeText={(text) => setFormData({ ...formData, horario_cierre: text })}
                        placeholder="23:00"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>
                </View>

                {/* Multimedia */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Multimedia</Text>

                {/* Imagen URL */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">URL de Imagen</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.imagen_url}
                      onChangeText={(text) => setFormData({ ...formData, imagen_url: text })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      keyboardType="url"
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Descripción</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.descripcion}
                      onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                      placeholder="Descripción del cine..."
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Información adicional para edición */}
                {editingCine && (
                  <View className="mt-6 rounded-3xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información del Cine
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingCine.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingCine.activo ? 'Activo' : 'Inactivo'}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Fecha de creación: {new Date(editingCine.fecha_creacion).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mt-6 flex-row space-x-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-3xl bg-gray-800/50 px-4 py-3">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={formLoading || !formData.nombre.trim() || !formData.direccion.trim()}
                className={`flex-1 rounded-3xl px-4 py-3 ${
                  formLoading || !formData.nombre.trim() || !formData.direccion.trim()
                    ? 'bg-gray-600/50'
                    : 'bg-gray-800/50'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-white">
                      {editingCine ? 'Actualizar' : 'Crear'}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Selector de Mapa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMapSelector}
        onRequestClose={() => setShowMapSelector(false)}>
        <View className="flex-1 bg-black/50">
          <View className="mt-16 flex-1 overflow-hidden rounded-t-3xl bg-black">
            {/* Header del selector de mapa */}
            <View className="border-b border-white/10 px-6 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-white">Seleccionar Ubicación</Text>
                <Pressable
                  onPress={() => setShowMapSelector(false)}
                  className="rounded-full bg-gray-800/50 p-2">
                  <X size={20} color="#9CA3AF" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-400">
                Selecciona el distrito donde se ubicará el cine
              </Text>
            </View>

            {/* Selector de Distritos de Lima */}
            <ScrollView className="flex-1 p-6">
              <View className="mb-6">
                <Text className="mb-2 text-lg font-semibold text-white">
                  Selecciona un Distrito
                </Text>
                <Text className="text-sm text-gray-400">
                  Elige el distrito donde se ubicará el cine
                </Text>
              </View>

              {/* Grid de distritos */}
              <View className="flex-row flex-wrap">
                {distritosLima.map((distrito, index) => (
                  <Pressable
                    key={index}
                    onPress={() => selectDistrito(distrito)}
                    className={`mb-3 mr-3 rounded-2xl px-4 py-3 ${distrito.color} backdrop-blur-xl`}>
                    <View className="items-center">
                      <MapPin size={20} color={distrito.textColor.replace('text-', '#')} />
                      <Text className={`mt-2 text-sm font-medium ${distrito.textColor}`}>
                        {distrito.nombre}
                      </Text>
                      <Text className="mt-1 text-xs text-gray-400">
                        {distrito.lat.toFixed(4)}, {distrito.lng.toFixed(4)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Información adicional */}
              <View className="mt-6 rounded-2xl bg-gray-800/50 p-4">
                <View className="mb-2 flex-row items-center">
                  <Navigation size={16} color="#9CA3AF" />
                  <Text className="ml-2 text-sm font-semibold text-white">
                    Coordenadas Actuales
                  </Text>
                </View>
                {formData.latitud && formData.longitud ? (
                  <View>
                    <Text className="text-xs text-gray-300">
                      Latitud: {formData.latitud.toFixed(6)}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Longitud: {formData.longitud.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-xs text-gray-400">
                    No se ha seleccionado ninguna ubicación
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
