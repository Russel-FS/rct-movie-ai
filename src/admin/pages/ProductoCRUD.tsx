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
  Image,
} from 'react-native';
import {
  Plus,
  Search,
  X,
  Save,
  RotateCcw,
  Package,
  ChevronRight,
  Edit3,
  Trash2,
  Star,
  DollarSign,
  ChevronDown,
  Check,
  Image as ImageIcon,
} from 'lucide-react-native';

import { Producto, CreateProductoDto, UpdateProductoDto } from '~/shared/types/producto';
import { CategoriaProducto } from '~/shared/types/categoria-producto';
import { ProductoService } from '~/shared/services/producto.service';
import { CategoriaProductoService } from '~/shared/services/categoria-producto.service';

export default function ProductoCRUD() {
  // Estados principales
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<CreateProductoDto>({
    categoria_id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen_url: '',
    destacado: false,
    orden: 0,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Estados para selectores
  const [showCategoriaSelector, setShowCategoriaSelector] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showUnavailable, selectedCategoria]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        selectedCategoria
          ? ProductoService.getProductosByCategoria(selectedCategoria, showUnavailable)
          : ProductoService.getAllProductos(showUnavailable),
        CategoriaProductoService.getAllCategorias(false),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por búsqueda
  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.descripcion &&
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (producto.categoria?.nombre &&
        producto.categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Abrir modal para crear producto
  const openCreateModal = () => {
    setEditingProducto(null);
    // Calcular el siguiente orden
    const maxOrden = productos.length > 0 ? Math.max(...productos.map((p) => p.orden)) : 0;
    setFormData({
      categoria_id: selectedCategoria || 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      imagen_url: '',
      destacado: false,
      orden: maxOrden + 1,
    });
    setModalVisible(true);
  };

  // Abrir modal para editar producto
  const openEditModal = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      categoria_id: producto.categoria_id,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      imagen_url: producto.imagen_url || '',
      destacado: producto.destacado,
      orden: producto.orden,
    });
    setModalVisible(true);
  };

  // Guardar producto
  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (formData.categoria_id === 0) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }

    if (formData.precio <= 0) {
      Alert.alert('Error', 'El precio debe ser mayor a 0');
      return;
    }

    try {
      setFormLoading(true);

      if (editingProducto) {
        await ProductoService.updateProducto(editingProducto.id, formData as UpdateProductoDto);
        Alert.alert('Éxito', 'Producto actualizado correctamente');
      } else {
        await ProductoService.createProducto(formData);
        Alert.alert('Éxito', 'Producto creado correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingProducto ? 'actualizar' : 'crear'} el producto`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar disponibilidad del producto (reemplaza eliminar)
  const toggleProductoStatus = async (producto: Producto) => {
    try {
      await ProductoService.toggleProductoDisponibilidad(producto.id, !producto.disponible);
      loadData();
      Alert.alert(
        'Éxito',
        `Producto ${!producto.disponible ? 'activado' : 'desactivado'} correctamente`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del producto');
    }
  };

  // Componente de tarjeta de producto estilo GeneroCRUD
  const ProductoCard = ({ producto }: { producto: Producto }) => (
    <Pressable
      className="mx-4 mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
      onPress={() => openEditModal(producto)}
      style={{ opacity: 1 }}>
      <View className="p-6">
        <View className="flex-row items-start">
          {/* Imagen del producto */}
          <View className="mr-4 h-16 w-16 overflow-hidden rounded-2xl bg-gray-700/50">
            {producto.imagen_url ? (
              <Image
                source={{ uri: producto.imagen_url }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Package size={24} color="#9CA3AF" />
              </View>
            )}
          </View>

          <View className="flex-1">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
                {producto.nombre}
              </Text>
              <View className="ml-3 flex-row items-center space-x-2">
                {producto.destacado && <Star size={14} color="#FCD34D" fill="#FCD34D" />}
                <Text className="text-xs text-gray-400">#{producto.orden}</Text>
              </View>
            </View>

            {/* Categoría */}
            {producto.categoria && (
              <View className="mb-1 flex-row items-center">
                {producto.categoria.icono && (
                  <Text className="mr-1 text-xs">{producto.categoria.icono}</Text>
                )}
                <Text className="text-sm text-gray-400">{producto.categoria.nombre}</Text>
              </View>
            )}

            {/* Descripción */}
            {producto.descripcion && (
              <Text className="mb-2 text-sm text-gray-400" numberOfLines={2}>
                {producto.descripcion}
              </Text>
            )}

            {/* Precio */}
            <View className="mb-3 flex-row items-center">
              <DollarSign size={12} color="#10B981" />
              <Text className="ml-1 text-base font-bold text-green-400">
                S/ {producto.precio.toFixed(2)}
              </Text>
            </View>

            {/* Badge de estado y botón de toggle */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                {!producto.disponible && (
                  <View className="rounded-full bg-red-500/10 px-3 py-1">
                    <Text className="text-xs font-medium text-red-400">No disponible</Text>
                  </View>
                )}
                {producto.destacado && (
                  <View className="rounded-full bg-yellow-500/10 px-3 py-1">
                    <Text className="text-xs font-medium text-yellow-400">Destacado</Text>
                  </View>
                )}
              </View>

              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  toggleProductoStatus(producto);
                }}
                className={`rounded-full px-4 py-2 ${
                  producto.disponible ? 'bg-red-500/10' : 'bg-green-500/10'
                }`}>
                <Text
                  className={`text-xs font-medium ${
                    producto.disponible ? 'text-red-400' : 'text-green-400'
                  }`}>
                  {producto.disponible ? 'Desactivar' : 'Activar'}
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
        <Text className="mt-4 text-white">Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header estilo GeneroCRUD */}
      <View className="px-4 pb-6 pt-14">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-400">Administración</Text>
            <Text className="text-2xl font-bold text-white">Productos</Text>
          </View>
          <Pressable onPress={loadData} className="rounded-full bg-gray-800/50 p-3">
            <RotateCcw size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Filtro por categoría */}
        <View className="mt-6">
          <Text className="mb-4 text-xl font-bold text-white">Filtrar por Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <Pressable
              onPress={() => setSelectedCategoria(null)}
              className={`mr-3 rounded-3xl px-5 py-3 ${
                selectedCategoria === null ? 'bg-white' : 'bg-gray-800/50'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  selectedCategoria === null ? 'text-black' : 'text-gray-300'
                }`}>
                Todas las categorías
              </Text>
            </Pressable>
            {categorias.map((categoria) => (
              <Pressable
                key={categoria.id}
                onPress={() => setSelectedCategoria(categoria.id)}
                className={`mr-3 rounded-3xl px-5 py-3 ${
                  selectedCategoria === categoria.id ? 'bg-white' : 'bg-gray-800/50'
                }`}>
                <View className="flex-row items-center">
                  {categoria.icono && <Text className="mr-2 text-sm">{categoria.icono}</Text>}
                  <Text
                    className={`text-sm font-medium ${
                      selectedCategoria === categoria.id ? 'text-black' : 'text-gray-300'
                    }`}>
                    {categoria.nombre}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stats y controles */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}{' '}
            encontrado
            {filteredProductos.length !== 1 ? 's' : ''}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-3 text-sm font-medium text-gray-400">Mostrar no disponibles</Text>
            <Switch
              value={showUnavailable}
              onValueChange={setShowUnavailable}
              trackColor={{ false: '#374151', true: '#FFFFFF' }}
              thumbColor={showUnavailable ? '#000000' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Barra de búsqueda y botón crear */}
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar productos..."
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

      {/* Lista de productos */}
      {filteredProductos.length > 0 ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredProductos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-4 py-20">
          <Package size={48} color="#6B7280" />
          <Text className="mb-2 mt-4 text-lg text-gray-400">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
          </Text>
          <Text className="px-8 text-center text-sm text-gray-500">
            {searchTerm
              ? 'Intenta con otro término de búsqueda o ajusta los filtros'
              : 'Comienza creando tu primer producto'}
          </Text>
          {!searchTerm && (
            <Pressable
              onPress={openCreateModal}
              className="mt-6 overflow-hidden rounded-3xl bg-gray-800/50 px-6 py-3">
              <View className="flex-row items-center">
                <Plus size={20} color="#9CA3AF" />
                <Text className="ml-2 font-medium text-white">Agregar Producto</Text>
              </View>
            </Pressable>
          )}
        </View>
      )}

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
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
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

                {/* Categoría */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Categoría *</Text>
                  <Pressable
                    onPress={() => setShowCategoriaSelector(!showCategoriaSelector)}
                    className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                    <View className="flex-row items-center">
                      {formData.categoria_id > 0 && (
                        <>
                          {categorias.find((c) => c.id === formData.categoria_id)?.icono && (
                            <Text className="mr-2">
                              {categorias.find((c) => c.id === formData.categoria_id)?.icono}
                            </Text>
                          )}
                          <Text className="text-white">
                            {categorias.find((c) => c.id === formData.categoria_id)?.nombre}
                          </Text>
                        </>
                      )}
                      {formData.categoria_id === 0 && (
                        <Text className="text-gray-400">Seleccionar categoría</Text>
                      )}
                    </View>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </Pressable>

                  {showCategoriaSelector && (
                    <View className="mt-2 overflow-hidden rounded-2xl bg-gray-800/30">
                      {categorias.map((categoria) => (
                        <Pressable
                          key={categoria.id}
                          onPress={() => {
                            setFormData({ ...formData, categoria_id: categoria.id });
                            setShowCategoriaSelector(false);
                          }}
                          className="flex-row items-center justify-between px-4 py-3">
                          <View className="flex-row items-center">
                            {categoria.icono && <Text className="mr-2">{categoria.icono}</Text>}
                            <Text className="text-white">{categoria.nombre}</Text>
                          </View>
                          {formData.categoria_id === categoria.id && (
                            <Check size={16} color="#9CA3AF" />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Nombre */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.nombre}
                      onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                      placeholder="Ej: Combo Familiar, Coca Cola 500ml"
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
                      placeholder="Descripción del producto"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Precio y Orden */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Precio *</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.precio.toString()}
                        onChangeText={(text) => {
                          const precio = parseFloat(text) || 0;
                          setFormData({ ...formData, precio });
                        }}
                        placeholder="15.50"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Orden</Text>
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
                  </View>
                </View>

                {/* URL de imagen */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">URL de imagen</Text>
                  <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                    <TextInput
                      value={formData.imagen_url}
                      onChangeText={(text) => setFormData({ ...formData, imagen_url: text })}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      placeholderTextColor="#9CA3AF"
                      className="px-4 py-3 text-white"
                    />
                  </View>
                </View>

                {/* Vista previa de imagen */}
                {formData.imagen_url && (
                  <View>
                    <Text className="mb-2 text-sm font-bold text-white">Vista previa</Text>
                    <View className="h-32 w-32 overflow-hidden rounded-2xl bg-gray-800/50">
                      <Image
                        source={{ uri: formData.imagen_url }}
                        className="h-full w-full"
                        resizeMode="cover"
                        onError={() => {}}
                      />
                    </View>
                  </View>
                )}

                {/* Destacado */}
                <View className="mt-2 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-4">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-white">Producto destacado</Text>
                    <Text className="text-sm text-gray-400">
                      Los productos destacados aparecen primero
                    </Text>
                  </View>
                  <Switch
                    value={formData.destacado}
                    onValueChange={(value) => setFormData({ ...formData, destacado: value })}
                    trackColor={{ false: '#374151', true: '#FFFFFF' }}
                    thumbColor={formData.destacado ? '#000000' : '#9CA3AF'}
                  />
                </View>

                {/* Información adicional para edición */}
                {editingProducto && (
                  <View className="mt-6 rounded-2xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información del Producto
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingProducto.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingProducto.disponible ? 'Disponible' : 'No disponible'}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Orden actual: {editingProducto.orden}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Creado: {new Date(editingProducto.fecha_creacion).toLocaleDateString('es-ES')}
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
                disabled={
                  formLoading ||
                  !formData.nombre.trim() ||
                  formData.categoria_id === 0 ||
                  formData.precio <= 0
                }
                className={`flex-1 rounded-3xl px-4 py-3 ${
                  formLoading ||
                  !formData.nombre.trim() ||
                  formData.categoria_id === 0 ||
                  formData.precio <= 0
                    ? 'bg-gray-600/50'
                    : 'bg-gray-800/50'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save size={16} color="#ffffff" />
                    <Text className="ml-2 font-bold text-white">
                      {editingProducto ? 'Actualizar' : 'Crear'}
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
