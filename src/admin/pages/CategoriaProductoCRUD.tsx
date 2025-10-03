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
  TouchableOpacity,
} from 'react-native';
import {
  Plus,
  Search,
  X,
  Save,
  RotateCcw,
  Tag,
  ChevronRight,
  Edit3,
  Trash2,
} from 'lucide-react-native';

import {
  CategoriaProducto,
  CreateCategoriaProductoDto,
  UpdateCategoriaProductoDto,
} from '~/shared/types/categoria-producto';
import { CategoriaProductoService } from '~/shared/services/categoria-producto.service';

export default function CategoriaProductoCRUD() {
  // Estados principales
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaProducto | null>(null);
  const [formData, setFormData] = useState<CreateCategoriaProductoDto>({
    nombre: '',
    descripcion: '',
    icono: '',
    color: '#3B82F6',
    orden: 0,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive]);

  const loadData = async () => {
    try {
      setLoading(true);
      const categoriasData = await CategoriaProductoService.getAllCategorias(showInactive);
      setCategorias(categoriasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorías por búsqueda
  const filteredCategorias = categorias.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categoria.descripcion &&
        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Abrir modal para crear categoría
  const openCreateModal = () => {
    setEditingCategoria(null);
    const maxOrden = categorias.length > 0 ? Math.max(...categorias.map((c) => c.orden)) : 0;
    setFormData({
      nombre: '',
      descripcion: '',
      icono: '',
      color: '#3B82F6',
      orden: maxOrden + 1,
    });
    setModalVisible(true);
  };

  // Abrir modal para editar categoría
  const openEditModal = (categoria: CategoriaProducto) => {
    setEditingCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono || '',
      color: categoria.color || '#3B82F6',
      orden: categoria.orden,
    });
    setModalVisible(true);
  };

  // Guardar categoría
  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    try {
      setFormLoading(true);

      if (editingCategoria) {
        await CategoriaProductoService.updateCategoria(
          editingCategoria.id,
          formData as UpdateCategoriaProductoDto
        );
        Alert.alert('Éxito', 'Categoría actualizada correctamente');
      } else {
        await CategoriaProductoService.createCategoria(formData);
        Alert.alert('Éxito', 'Categoría creada correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingCategoria ? 'actualizar' : 'crear'} la categoría`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de categoría
  const toggleCategoriaStatus = async (categoria: CategoriaProducto) => {
    try {
      await CategoriaProductoService.toggleCategoriaStatus(categoria.id, !categoria.activa);
      loadData();
      Alert.alert(
        'Éxito',
        `Categoría ${!categoria.activa ? 'activada' : 'desactivada'} correctamente`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la categoría');
    }
  };

  // Eliminar categoría
  const handleDelete = async (categoria: CategoriaProducto) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await CategoriaProductoService.deleteCategoria(categoria.id);
              Alert.alert('Éxito', 'Categoría eliminada correctamente');
              loadData();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la categoría');
            }
          },
        },
      ]
    );
  };

  // Componente de tarjeta de categoría
  const CategoriaCard = ({ categoria }: { categoria: CategoriaProducto }) => {
    return (
      <View className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50">
        <View className="flex-row items-center p-6">
          <View
            className="mr-4 rounded-full p-3"
            style={{ backgroundColor: categoria.color ? `${categoria.color}20` : '#374151' }}>
            {categoria.icono ? (
              <Text className="text-lg">{categoria.icono}</Text>
            ) : (
              <Tag size={20} color={categoria.color || '#9CA3AF'} />
            )}
          </View>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-base font-medium text-white" numberOfLines={1}>
                {categoria.nombre}
              </Text>
              <View className="flex-row items-center space-x-2">
                <Text className="text-xs text-gray-400">#{categoria.orden}</Text>
                <Text className="text-xs text-gray-400">ID: {categoria.id}</Text>
              </View>
            </View>

            {categoria.descripcion && (
              <Text className="mb-2 text-sm text-gray-400" numberOfLines={2}>
                {categoria.descripcion}
              </Text>
            )}

            <View className="flex-row items-center space-x-4">
              {categoria.color && (
                <View className="flex-row items-center">
                  <View
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: categoria.color }}
                  />
                  <Text className="text-xs text-gray-400">{categoria.color}</Text>
                </View>
              )}

              {!categoria.activa && (
                <View className="rounded-full bg-red-500/10 px-3 py-1">
                  <Text className="text-xs font-medium text-red-400">Inactiva</Text>
                </View>
              )}
            </View>
          </View>

          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => openEditModal(categoria)}
              className="rounded-full bg-blue-500/10 p-2"
              activeOpacity={0.7}>
              <Edit3 size={16} color="#3B82F6" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(categoria)}
              className="rounded-full bg-red-500/10 p-2"
              activeOpacity={0.7}>
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>

            <ChevronRight size={20} color="#6B7280" />
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pb-6 pt-14">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-gray-400">Administración</Text>
              <Text className="text-2xl font-bold text-white">Categorías de Productos</Text>
            </View>
            <Pressable onPress={loadData} className="rounded-full bg-gray-800/50 p-3">
              <RotateCcw size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* Configuración */}
          <Text className="mb-6 mt-8 text-xl font-bold text-white">Configuración</Text>

          <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-6">
            <View className="flex-1">
              <Text className="text-base font-medium text-white">Mostrar categorías inactivas</Text>
              <Text className="text-sm text-gray-400">
                {filteredCategorias.length} categoría{filteredCategorias.length !== 1 ? 's' : ''}{' '}
                encontrada
                {filteredCategorias.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <Switch
              value={showInactive}
              onValueChange={setShowInactive}
              trackColor={{ false: '#374151', true: '#FFFFFF' }}
              thumbColor={showInactive ? '#000000' : '#9CA3AF'}
            />
          </View>

          {/* Barra de búsqueda y botón crear */}
          <View className="mb-6 flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-4">
              <Search size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Buscar categorías..."
                placeholderTextColor="#9CA3AF"
                className="ml-3 flex-1 text-white"
                value={searchTerm}
                onChangeText={setSearchTerm}
                returnKeyType="search"
              />
            </View>

            <Pressable onPress={openCreateModal} className="rounded-3xl bg-gray-800/50 p-4">
              <Plus size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        <View className="px-4">
          {/* Lista de categorías */}
          <Text className="mb-6 text-xl font-bold text-white">Categorías Disponibles</Text>

          {filteredCategorias.length > 0 ? (
            filteredCategorias.map((categoria) => (
              <CategoriaCard key={categoria.id} categoria={categoria} />
            ))
          ) : (
            <View className="items-center rounded-3xl bg-gray-800/30 p-8">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-700/50">
                <Tag size={32} color="#9CA3AF" />
              </View>
              <Text className="mb-2 text-xl font-bold text-white">
                {searchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
              </Text>
              <Text className="mb-6 text-center text-sm text-gray-400">
                {searchTerm
                  ? 'Intenta con otro término de búsqueda o ajusta los filtros'
                  : 'Comienza creando tu primera categoría de productos'}
              </Text>
              {!searchTerm && (
                <Pressable
                  onPress={openCreateModal}
                  className="overflow-hidden rounded-3xl bg-white px-6 py-3">
                  <View className="flex-row items-center">
                    <Plus size={20} color="#000000" />
                    <Text className="ml-2 font-semibold text-black">Crear Primera Categoría</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          <View className="h-20" />
        </View>
      </ScrollView>

      {/* Modal de formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50">
          <View
            className="mt-12 flex-1 rounded-t-3xl bg-black px-6 py-6"
            style={{ backgroundColor: '#000000' }}>
            {/* Header del modal */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-gray-800/50 p-3">
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

                {/* Nombre */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.nombre}
                      onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                      placeholder="Ej: Bebidas, Snacks, Combos"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
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
                      placeholder="Descripción opcional de la categoría"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Icono y Color */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Icono</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.icono}
                        onChangeText={(text) => setFormData({ ...formData, icono: text })}
                        placeholder="🍿 (emoji o nombre)"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Color</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.color}
                        onChangeText={(text) => setFormData({ ...formData, color: text })}
                        placeholder="#3B82F6"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>
                </View>

                {/* Orden */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Orden de visualización</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.orden.toString()}
                      onChangeText={(text) => {
                        const orden = parseInt(text) || 0;
                        setFormData({ ...formData, orden });
                      }}
                      placeholder="1"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      keyboardType="numeric"
                    />
                  </View>
                  <Text className="mt-1 text-xs text-gray-400">
                    Número que determina el orden de aparición (menor número = aparece primero)
                  </Text>
                </View>

                {/* Información adicional para edición */}
                {editingCategoria && (
                  <View className="mt-6 rounded-2xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información de la Categoría
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingCategoria.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingCategoria.activa ? 'Activa' : 'Inactiva'}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Orden actual: {editingCategoria.orden}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Creada:{' '}
                      {new Date(editingCategoria.fecha_creacion).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mb-6 mt-6 flex-row gap-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-3xl bg-gray-800/50 px-6 py-4">
                <Text className="text-center text-base font-semibold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={formLoading || !formData.nombre.trim()}
                className={`flex-1 rounded-3xl px-6 py-4 ${
                  formLoading || !formData.nombre.trim() ? 'bg-gray-600/50' : 'bg-white'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save
                      size={16}
                      color={formLoading || !formData.nombre.trim() ? '#ffffff' : '#000000'}
                    />
                    <Text
                      className={`ml-2 text-base font-semibold ${
                        formLoading || !formData.nombre.trim() ? 'text-white' : 'text-black'
                      }`}>
                      {editingCategoria ? 'Actualizar Categoría' : 'Crear Categoría'}
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
