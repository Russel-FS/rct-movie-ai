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
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react-native';
import { Cine, CreateCineDto, UpdateCineDto } from '~/shared/types/cine';
import { CineService } from '~/shared/services/cine.service';

export default function CineCRUD() {
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

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive]);

  const loadData = async () => {
    try {
      setLoading(true);
      const cinesData = await CineService.getCines();
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

  // Componente de tarjeta de cine
  const CineCard = ({ cine }: { cine: Cine }) => (
    <View className="mx-2 mb-4 rounded-lg bg-gray-800 p-4">
      <View className="mb-3 flex-row items-start">
        <View className="mr-3 rounded-full bg-amber-600 p-3">
          <MapPin size={20} color="#ffffff" />
        </View>

        <View className="flex-1">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="flex-1 text-lg font-bold text-white" numberOfLines={1}>
              {cine.nombre}
            </Text>
            <Text className="ml-2 text-xs text-gray-400">ID: {cine.id}</Text>
          </View>

          <Text className="mb-2 text-sm text-gray-300">{cine.direccion}</Text>

          {cine.telefono && (
            <View className="mb-1 flex-row items-center">
              <Phone size={12} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-400">{cine.telefono}</Text>
            </View>
          )}

          {cine.email && (
            <View className="mb-1 flex-row items-center">
              <Mail size={12} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-400">{cine.email}</Text>
            </View>
          )}

          {cine.horario_apertura && cine.horario_cierre && (
            <View className="mb-1 flex-row items-center">
              <Clock size={12} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-400">
                {cine.horario_apertura} - {cine.horario_cierre}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Badge de estado */}
      {!cine.activo && (
        <View className="mb-3">
          <View className="inline-flex self-start rounded bg-red-600 px-2 py-1">
            <Text className="text-xs font-bold text-white">Inactivo</Text>
          </View>
        </View>
      )}

      {/* Botones de acción */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => openEditModal(cine)}
          className="mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-2">
          <Edit size={16} color="#ffffff" />
          <Text className="ml-2 font-bold text-white">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleCineStatus(cine)}
          className={`flex-row items-center justify-center rounded-lg px-4 py-2 ${
            cine.activo ? 'bg-red-600' : 'bg-green-600'
          }`}>
          {cine.activo ? (
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
        <Text className="mt-4 text-white">Cargando cines...</Text>
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
            {filteredCines.length} cine{filteredCines.length !== 1 ? 's' : ''}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-gray-400">Mostrar inactivos</Text>
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
              placeholder="Buscar cines..."
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

      {/* Lista de cines */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredCines.length > 0 ? (
          filteredCines.map((cine) => <CineCard key={cine.id} cine={cine} />)
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <MapPin size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron cines</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay cines disponibles'}
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
          <View className="max-h-[90%] rounded-t-3xl bg-gray-900 px-6 py-6">
            {/* Header del modal */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingCine ? 'Editar Cine' : 'Nuevo Cine'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="space-y-4">
                {/* Nombre */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                  <TextInput
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                    placeholder="Nombre del cine"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  />
                </View>

                {/* Dirección */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Dirección *</Text>
                  <TextInput
                    value={formData.direccion}
                    onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                    placeholder="Dirección completa"
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                    multiline
                    numberOfLines={2}
                  />
                </View>

                {/* Teléfono y Email */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Teléfono</Text>
                    <TextInput
                      value={formData.telefono}
                      onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                      placeholder="+1234567890"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Email</Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      placeholder="cine@ejemplo.com"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                {/* Horarios */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Apertura</Text>
                    <TextInput
                      value={formData.horario_apertura}
                      onChangeText={(text) => setFormData({ ...formData, horario_apertura: text })}
                      placeholder="09:00"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Cierre</Text>
                    <TextInput
                      value={formData.horario_cierre}
                      onChangeText={(text) => setFormData({ ...formData, horario_cierre: text })}
                      placeholder="23:00"
                      placeholderTextColor="#9CA3AF"
                      className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Descripción */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Descripción</Text>
                  <TextInput
                    value={formData.descripcion}
                    onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                    placeholder="Descripción del cine..."
                    placeholderTextColor="#9CA3AF"
                    className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mt-6 flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-lg bg-gray-600 px-4 py-3">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={formLoading || !formData.nombre.trim() || !formData.direccion.trim()}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  formLoading || !formData.nombre.trim() || !formData.direccion.trim()
                    ? 'bg-gray-500'
                    : 'bg-green-600'
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
