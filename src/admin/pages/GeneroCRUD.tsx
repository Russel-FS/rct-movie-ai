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
  Eye,
  EyeOff,
  Tag,
  Film,
  ChevronRight,
} from 'lucide-react-native';
import { GeneroMovie, CreateGeneroDto, UpdateGeneroDto } from '~/shared/types/genero';
import { GeneroService } from '~/home/services/genero.service';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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

  // Componente de tarjeta de género estilo Perfil
  const GeneroCard = ({ genero }: { genero: GeneroMovie }) => (
    <Pressable
      className="mx-4 mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      onPress={() => openEditModal(genero)}
      style={{ opacity: 1 }}>
      <View className="p-6">
        <View className="flex-row items-start">
          <View className="mr-4 rounded-full bg-gray-700/50 p-3">
            <Tag size={20} color="#9CA3AF" />
          </View>

          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
                {genero.nombre}
              </Text>
              <Text className="ml-3 text-xs text-gray-400">ID: {genero.id}</Text>
            </View>

            {genero.descripcion && (
              <Text className="mb-2 text-sm text-gray-400" numberOfLines={2}>
                {genero.descripcion}
              </Text>
            )}

            <View className="mb-3 flex-row items-center">
              <Film size={12} color="#6B7280" />
              <Text className="ml-2 text-xs text-gray-500">Categoría de películas</Text>
            </View>

            {/* Badge de estado y botón de toggle */}
            <View className="flex-row items-center justify-between">
              {!genero.activo && (
                <View className="rounded-full bg-red-500/10 px-3 py-1">
                  <Text className="text-xs font-medium text-red-400">Inactivo</Text>
                </View>
              )}

              <View className="flex-1" />

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleGeneroStatus(genero);
                }}
                className={`rounded-full px-4 py-2 ${
                  genero.activo ? 'bg-red-500/10' : 'bg-green-500/10'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    genero.activo ? 'text-red-400' : 'text-green-400'
                  }`}>
                  {genero.activo ? 'Desactivar' : 'Activar'}
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
        <Text className="mt-4 text-white">Cargando géneros...</Text>
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
            <Text className="text-2xl font-bold text-white">Géneros</Text>
          </View>
          <Pressable onPress={loadData} className="rounded-full bg-gray-800/50 p-3">
            <RotateCcw size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Stats y controles */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredGeneros.length} género{filteredGeneros.length !== 1 ? 's' : ''} encontrado
            {filteredGeneros.length !== 1 ? 's' : ''}
          </Text>
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
              placeholder="Buscar géneros..."
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

      {/* Lista de géneros */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredGeneros.length > 0 ? (
          filteredGeneros.map((genero) => <GeneroCard key={genero.id} genero={genero} />)
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <Tag size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron géneros</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay géneros disponibles'}
            </Text>
            {!searchTerm && (
              <Pressable
                onPress={openCreateModal}
                className="mt-6 overflow-hidden rounded-3xl bg-gray-800/50 px-6 py-3">
                <View className="flex-row items-center">
                  <Plus size={20} color="#9CA3AF" />
                  <Text className="ml-2 font-medium text-white">Agregar Género</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario estilo Apple */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-black px-6 py-6">
            {/* Header del modal */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingGenero ? 'Editar Género' : 'Nuevo Género'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-gray-800/50 p-2">
                <X size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* Formulario */}
            <View className="space-y-4">
              {/* Nombre */}
              <View>
                <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                  <TextInput
                    value={formData.nombre}
                    onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                    placeholder="Ej: Acción, Comedia, Drama..."
                    placeholderTextColor="#9CA3AF"
                    className="px-4 py-3 text-white"
                    maxLength={50}
                  />
                </View>
                <Text className="mt-1 text-xs text-gray-400">
                  {formData.nombre.length}/50 caracteres
                </Text>
              </View>

              {/* Descripción */}
              <View>
                <Text className="mb-2 text-sm font-bold text-white">Descripción</Text>
                <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                  <TextInput
                    value={formData.descripcion}
                    onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                    placeholder="Descripción opcional del género..."
                    placeholderTextColor="#9CA3AF"
                    className="px-4 py-3 text-white"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    maxLength={200}
                  />
                </View>
                <Text className="mt-1 text-xs text-gray-400">
                  {(formData.descripcion || '').length}/200 caracteres
                </Text>
              </View>

              {/* Información adicional para edición */}
              {editingGenero && (
                <View className="rounded-3xl bg-gray-800/30 p-4">
                  <Text className="mb-2 text-sm font-bold text-gray-400">
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
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-3xl bg-gray-800/50 px-4 py-3">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={formLoading || !formData.nombre.trim()}
                className={`flex-1 rounded-3xl px-4 py-3 ${
                  formLoading || !formData.nombre.trim() ? 'bg-gray-600/50' : 'bg-gray-800/50'
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
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
