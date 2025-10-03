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
  Tag,
  Film,
} from 'lucide-react-native';
import { GeneroMovie, CreateGeneroDto, UpdateGeneroDto } from '~/shared/types/genero';
import { GeneroService } from '../services/genero.service';

export default function GeneroCRUD() {
  // Estados principales
  const [generos, setGeneros] = useState<GeneroMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGenero, setEditingGenero] = useState<GeneroMovie | null>(null);
  const [formData, setFormData] = useState<CreateGeneroDto>({
    nombre: '',
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
      const generosData = showInactive
        ? await GeneroService.getAllGeneros()
        : await GeneroService.getGeneros();
      setGeneros(generosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los géneros');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar géneros por búsqueda
  const filteredGeneros = generos.filter(
    (genero) =>
      genero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genero.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear género
  const openCreateModal = () => {
    setEditingGenero(null);
    setFormData({
      nombre: '',
      descripcion: '',
    });
    setModalVisible(true);
  };

  // Abrir modal para editar género
  const openEditModal = (genero: GeneroMovie) => {
    setEditingGenero(genero);
    setFormData({
      nombre: genero.nombre,
      descripcion: genero.descripcion || '',
    });
    setModalVisible(true);
  };

  // Guardar género (crear o editar)
  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    try {
      setFormLoading(true);

      if (editingGenero) {
        await GeneroService.actualizarGenero(editingGenero.id, formData as UpdateGeneroDto);
        Alert.alert('Éxito', 'Género actualizado correctamente');
      } else {
        await GeneroService.crearGenero(formData);
        Alert.alert('Éxito', 'Género creado correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingGenero ? 'actualizar' : 'crear'} el género`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de género
  const toggleGeneroStatus = async (genero: GeneroMovie) => {
    try {
      await GeneroService.actualizarEstadoGenero(genero.id, !genero.activo);
      loadData();
      Alert.alert('Éxito', `Género ${!genero.activo ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del género');
    }
  };

  // Confirmar eliminación física (solo para casos especiales)
  /* Funcionalidad de eliminación física desactivada temporalmente
  const confirmPhysicalDelete = (genero: GeneroMovie) => {
    Alert.alert(
      'Eliminar Permanentemente',
      `¿Estás seguro de que quieres eliminar permanentemente el género "${genero.nombre}"?\n\nEsta acción no se puede deshacer y solo es posible si no tiene películas asociadas.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handlePhysicalDelete(genero),
        },
      ]
    );
  };

  // Eliminar físicamente el género
  const handlePhysicalDelete = async (genero: GeneroMovie) => {
    try {
      await GeneroService.eliminarGeneroFisico(genero.id);
      loadData();
      Alert.alert('Éxito', 'Género eliminado permanentemente');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo eliminar el género');
    }
  };
  */

  // Componente de tarjeta de género
  const GeneroCard = ({ genero }: { genero: GeneroMovie }) => (
    <View className="mx-2 mb-4 rounded-lg bg-gray-800 p-4">
      <View className="mb-3 flex-row items-start">
        <View className="mr-3 rounded-full bg-blue-600 p-3">
          <Tag size={20} color="#ffffff" />
        </View>

        <View className="flex-1">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {genero.nombre}
            </Text>
            <Text className="text-xs text-gray-400">ID: {genero.id}</Text>
          </View>

          {genero.descripcion && (
            <Text className="mb-2 text-sm text-gray-300" numberOfLines={3}>
              {genero.descripcion}
            </Text>
          )}

          <View className="flex-row items-center">
            <Film size={12} color="#9CA3AF" />
            <Text className="ml-1 text-xs text-gray-400">Género de películas</Text>
          </View>
        </View>
      </View>

      {/* Badge de estado */}
      {!genero.activo && (
        <View className="mb-3">
          <View className="inline-flex self-start rounded bg-red-600 px-2 py-1">
            <Text className="text-xs font-bold text-white">Inactivo</Text>
          </View>
        </View>
      )}

      {/* Botones de acción */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => openEditModal(genero)}
          className="mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-2">
          <Edit size={16} color="#ffffff" />
          <Text className="ml-2 font-bold text-white">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleGeneroStatus(genero)}
          className={`mr-2 flex-row items-center justify-center rounded-lg px-4 py-2 ${
            genero.activo ? 'bg-red-600' : 'bg-green-600'
          }`}>
          {genero.activo ? (
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

        {/* Botón de eliminar físicamente (solo para géneros inactivos) - Temporalmente desactivado
        {!genero.activo && (
          <TouchableOpacity
            onPress={() => confirmPhysicalDelete(genero)}
            className="flex-row items-center justify-center rounded-lg bg-red-800 px-3 py-2">
            <X size={16} color="#ffffff" />
          </TouchableOpacity>
        )}
        */}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando géneros...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pb-4 pt-14">
        <Text className="mb-1 text-sm text-gray-400">Administración</Text>
        <Text className="mb-4 text-2xl font-bold text-white">Gestión de Géneros</Text>

        {/* Stats */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredGeneros.length} género{filteredGeneros.length !== 1 ? 's' : ''}
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
              placeholder="Buscar géneros..."
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

      {/* Lista de géneros */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredGeneros.length > 0 ? (
          filteredGeneros.map((genero) => <GeneroCard key={genero.id} genero={genero} />)
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <Tag size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron géneros</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay géneros disponibles'}
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
          <View className="rounded-t-3xl bg-gray-900 px-6 py-6">
            {/* Header del modal */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingGenero ? 'Editar Género' : 'Nuevo Género'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <View className="space-y-4">
              {/* Nombre */}
              <View>
                <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                <TextInput
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  placeholder="Ej: Acción, Comedia, Drama..."
                  placeholderTextColor="#9CA3AF"
                  className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  maxLength={50}
                />
                <Text className="mt-1 text-xs text-gray-400">
                  {formData.nombre.length}/50 caracteres
                </Text>
              </View>

              {/* Descripción */}
              <View>
                <Text className="mb-2 text-sm font-bold text-white">Descripción</Text>
                <TextInput
                  value={formData.descripcion}
                  onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                  placeholder="Descripción opcional del género..."
                  placeholderTextColor="#9CA3AF"
                  className="rounded-lg bg-gray-800 px-4 py-3 text-white"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text className="mt-1 text-xs text-gray-400">
                  {(formData.descripcion || '').length}/200 caracteres
                </Text>
              </View>

              {/* Información adicional para edición */}
              {editingGenero && (
                <View className="rounded-lg bg-gray-800 p-4">
                  <Text className="mb-2 text-sm font-bold text-yellow-400">
                    Información del Género
                  </Text>
                  <Text className="text-xs text-gray-300">ID: {editingGenero.id}</Text>
                  <Text className="text-xs text-gray-300">
                    Estado: {editingGenero.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
              )}
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
                disabled={formLoading || !formData.nombre.trim()}
                className={`flex-1 rounded-lg px-4 py-3 ${
                  formLoading || !formData.nombre.trim() ? 'bg-gray-500' : 'bg-green-600'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-white">
                      {editingGenero ? 'Actualizar' : 'Crear'}
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
