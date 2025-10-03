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
  Building,
  Users,
  Grid3X3,
  ChevronRight,
  ChevronDown,
  Check,
  Trash2,
  MapPin,
} from 'lucide-react-native';

import { Sala, CreateSalaDto, UpdateSalaDto, Fila, CreateFilaDto } from '~/shared/types/sala';
import { Cine } from '~/shared/types/cine';
import { SalaService } from '~/shared/services/sala.service';
import { CineService } from '~/shared/services/cine.service';

const tiposSala = ['Estándar', 'VIP', '3D', 'IMAX', '4DX', 'Premium'];
const tiposFila = ['Normal', 'VIP', 'Premium', 'Discapacitado'];

export default function SalaCRUD() {
  // Estados principales
  const [salas, setSalas] = useState<Sala[]>([]);
  const [cines, setCines] = useState<Cine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedCine, setSelectedCine] = useState<number | null>(null);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSala, setEditingSala] = useState<Sala | null>(null);
  const [formData, setFormData] = useState<CreateSalaDto>({
    cine_id: 0,
    nombre: '',
    capacidad: 0,
    tipo: 'Estándar',
    configuracion_general: {},
  });
  const [formLoading, setFormLoading] = useState(false);

  // Estados para filas
  const [filas, setFilas] = useState<CreateFilaDto[]>([]);
  const [showCineSelector, setShowCineSelector] = useState(false);
  const [showTipoSelector, setShowTipoSelector] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [showInactive, selectedCine]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [salasData, cinesData] = await Promise.all([
        selectedCine
          ? SalaService.getSalasByCine(selectedCine, showInactive)
          : SalaService.getAllSalas(showInactive),
        CineService.getCines(),
      ]);
      setSalas(salasData);
      setCines(cinesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar salas por búsqueda
  const filteredSalas = salas.filter(
    (sala) =>
      sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear sala
  const openCreateModal = () => {
    setEditingSala(null);
    setFormData({
      cine_id: selectedCine || 0,
      nombre: '',
      capacidad: 0,
      tipo: 'Estándar',
      configuracion_general: {},
    });
    setFilas([]);
    setModalVisible(true);
  };

  // Abrir modal para editar sala
  const openEditModal = async (sala: Sala) => {
    try {
      setEditingSala(sala);
      setFormData({
        cine_id: sala.cine_id,
        nombre: sala.nombre,
        capacidad: sala.capacidad,
        tipo: sala.tipo,
        configuracion_general: sala.configuracion_general || {},
      });

      // Cargar filas de la sala
      const filasData = await SalaService.getFilasBySala(sala.id);
      setFilas(
        filasData.map((fila) => ({
          letra: fila.letra,
          numero_fila: fila.numero_fila,
          tipo_fila: fila.tipo_fila,
          cantidad_asientos: fila.cantidad_asientos,
          precio_multiplicador: fila.precio_multiplicador,
        }))
      );

      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos de la sala');
    }
  };

  // Agregar nueva fila
  const addFila = () => {
    const nextLetter = String.fromCharCode(65 + filas.length); // A, B, C...
    const newFila: CreateFilaDto = {
      letra: nextLetter,
      numero_fila: filas.length + 1,
      tipo_fila: 'Normal',
      cantidad_asientos: 10,
      precio_multiplicador: 1.0,
    };
    setFilas([...filas, newFila]);

    // Actualizar capacidad total
    const nuevaCapacidad =
      filas.reduce((total, fila) => total + fila.cantidad_asientos, 0) + newFila.cantidad_asientos;
    setFormData({ ...formData, capacidad: nuevaCapacidad });
  };

  // Eliminar fila
  const removeFila = (index: number) => {
    const nuevasFilas = filas.filter((_, i) => i !== index);
    setFilas(nuevasFilas);

    const nuevaCapacidad = nuevasFilas.reduce((total, fila) => total + fila.cantidad_asientos, 0);
    setFormData({ ...formData, capacidad: nuevaCapacidad });
  };

  // Actualizar fila
  const updateFila = (index: number, updatedFila: CreateFilaDto) => {
    const nuevasFilas = [...filas];
    nuevasFilas[index] = updatedFila;
    setFilas(nuevasFilas);

    const nuevaCapacidad = nuevasFilas.reduce((total, fila) => total + fila.cantidad_asientos, 0);
    setFormData({ ...formData, capacidad: nuevaCapacidad });
  };

  // Guardar sala
  const handleSave = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (formData.cine_id === 0) {
      Alert.alert('Error', 'Selecciona un cine');
      return;
    }

    if (filas.length === 0) {
      Alert.alert('Error', 'Agrega al menos una fila');
      return;
    }

    try {
      setFormLoading(true);

      if (editingSala) {
        await SalaService.updateSala(editingSala.id, formData as UpdateSalaDto, filas);
        Alert.alert('Éxito', 'Sala actualizada correctamente');
      } else {
        await SalaService.createSala(formData, filas);
        Alert.alert('Éxito', 'Sala creada correctamente');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingSala ? 'actualizar' : 'crear'} la sala`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de sala
  const toggleSalaStatus = async (sala: Sala) => {
    try {
      await SalaService.toggleSalaStatus(sala.id, !sala.activa);
      loadData();
      Alert.alert('Éxito', `Sala ${!sala.activa ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la sala');
    }
  };

  // Componente de tarjeta de sala
  const SalaCard = ({ sala }: { sala: Sala }) => {
    const cine = cines.find((c) => c.id === sala.cine_id);

    return (
      <Pressable
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-gray-800"
        onPress={() => openEditModal(sala)}>
        <View className="p-5">
          <View className="flex-row items-start">
            <View className="mr-4 rounded-xl bg-gray-700 p-3">
              <Building size={20} color="#9CA3AF" />
            </View>

            <View className="flex-1">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="flex-1 text-base font-medium text-white" numberOfLines={1}>
                  {sala.nombre}
                </Text>
                <Text className="ml-3 text-xs text-gray-400">ID: {sala.id}</Text>
              </View>

              <View className="mb-2 flex-row items-center">
                <MapPin size={12} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-400">
                  {cine?.nombre || 'Cine no encontrado'}
                </Text>
              </View>

              <View className="mb-3 flex-row items-center space-x-4">
                <View className="flex-row items-center">
                  <Users size={12} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-400">{sala.capacidad} asientos</Text>
                </View>

                <View className="rounded-full bg-blue-500/10 px-2 py-1">
                  <Text className="text-xs font-medium text-blue-400">{sala.tipo}</Text>
                </View>
              </View>

              {/* Badge de estado y botón de toggle */}
              <View className="flex-row items-center justify-between">
                {!sala.activa && (
                  <View className="rounded-full bg-red-500/10 px-3 py-1">
                    <Text className="text-xs font-medium text-red-400">Inactiva</Text>
                  </View>
                )}

                <View className="flex-1" />

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleSalaStatus(sala);
                  }}
                  className={`rounded-full px-4 py-2 ${
                    sala.activa ? 'bg-red-500/10' : 'bg-green-500/10'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${
                      sala.activa ? 'text-red-400' : 'text-green-400'
                    }`}>
                    {sala.activa ? 'Desactivar' : 'Activar'}
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
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando salas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pb-6 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-400">Administración</Text>
            <Text className="text-2xl font-bold text-white">Salas</Text>
          </View>
          <Pressable onPress={loadData} className="rounded-full bg-gray-800 p-3">
            <RotateCcw size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Filtro por cine */}
        <View className="mt-6">
          <Text className="mb-2 text-sm font-medium text-gray-400">Filtrar por cine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <Pressable
              onPress={() => setSelectedCine(null)}
              className={`mr-3 rounded-full px-4 py-2 ${
                selectedCine === null ? 'bg-white' : 'bg-gray-800'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  selectedCine === null ? 'text-black' : 'text-gray-300'
                }`}>
                Todos
              </Text>
            </Pressable>
            {cines.map((cine) => (
              <Pressable
                key={cine.id}
                onPress={() => setSelectedCine(cine.id)}
                className={`mr-3 rounded-full px-4 py-2 ${
                  selectedCine === cine.id ? 'bg-white' : 'bg-gray-800'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    selectedCine === cine.id ? 'text-black' : 'text-gray-300'
                  }`}>
                  {cine.nombre}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stats y controles */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="text-sm text-gray-400">
            {filteredSalas.length} sala{filteredSalas.length !== 1 ? 's' : ''} encontrada
            {filteredSalas.length !== 1 ? 's' : ''}
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
          <View className="flex-1 flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar salas..."
              placeholderTextColor="#9CA3AF"
              className="ml-3 flex-1 text-white"
              value={searchTerm}
              onChangeText={setSearchTerm}
              returnKeyType="search"
            />
          </View>

          <Pressable onPress={openCreateModal} className="rounded-2xl bg-gray-800 p-3">
            <Plus size={20} color="#9CA3AF" />
          </Pressable>
        </View>
      </View>

      {/* Lista de salas */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredSalas.length > 0 ? (
          filteredSalas.map((sala) => <SalaCard key={sala.id} sala={sala} />)
        ) : (
          <View className="flex-1 items-center justify-center px-4 py-20">
            <Building size={48} color="#6B7280" />
            <Text className="mb-2 mt-4 text-lg text-gray-400">No se encontraron salas</Text>
            <Text className="px-8 text-center text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay salas disponibles'}
            </Text>
            {!searchTerm && (
              <Pressable
                onPress={openCreateModal}
                className="mt-6 overflow-hidden rounded-2xl bg-gray-800 px-6 py-3">
                <View className="flex-row items-center">
                  <Plus size={20} color="#9CA3AF" />
                  <Text className="ml-2 font-medium text-white">Agregar Sala</Text>
                </View>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50">
          <View className="mt-12 flex-1 rounded-t-3xl bg-black px-6 py-6">
            {/* Header del modal */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">
                {editingSala ? 'Editar Sala' : 'Nueva Sala'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-gray-800 p-2">
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

                {/* Cine */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Cine *</Text>
                  <Pressable
                    onPress={() => setShowCineSelector(!showCineSelector)}
                    className="flex-row items-center justify-between rounded-2xl bg-gray-800 px-4 py-3">
                    <Text className="text-white">
                      {formData.cine_id
                        ? cines.find((c) => c.id === formData.cine_id)?.nombre
                        : 'Seleccionar cine'}
                    </Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </Pressable>

                  {showCineSelector && (
                    <View className="mt-2 overflow-hidden rounded-2xl bg-gray-800/30">
                      {cines.map((cine) => (
                        <Pressable
                          key={cine.id}
                          onPress={() => {
                            setFormData({ ...formData, cine_id: cine.id });
                            setShowCineSelector(false);
                          }}
                          className="flex-row items-center justify-between px-4 py-3">
                          <Text className="text-white">{cine.nombre}</Text>
                          {formData.cine_id === cine.id && <Check size={16} color="#9CA3AF" />}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Nombre y Tipo */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
                    <View className="overflow-hidden rounded-2xl bg-gray-800">
                      <TextInput
                        value={formData.nombre}
                        onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                        placeholder="Ej: Sala 1"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Tipo *</Text>
                    <Pressable
                      onPress={() => setShowTipoSelector(!showTipoSelector)}
                      className="flex-row items-center justify-between rounded-2xl bg-gray-800 px-4 py-3">
                      <Text className="text-white">{formData.tipo}</Text>
                      <ChevronDown size={20} color="#9CA3AF" />
                    </Pressable>

                    {showTipoSelector && (
                      <View className="mt-2 overflow-hidden rounded-2xl bg-gray-800/30">
                        {tiposSala.map((tipo) => (
                          <Pressable
                            key={tipo}
                            onPress={() => {
                              setFormData({ ...formData, tipo });
                              setShowTipoSelector(false);
                            }}
                            className="flex-row items-center justify-between px-4 py-3">
                            <Text className="text-white">{tipo}</Text>
                            {formData.tipo === tipo && <Check size={16} color="#9CA3AF" />}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Capacidad Total */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Capacidad Total</Text>
                  <View className="rounded-2xl bg-gray-800/30 px-4 py-3">
                    <Text className="text-lg font-bold text-white">
                      {formData.capacidad} asientos
                    </Text>
                    <Text className="text-xs text-gray-400">
                      Se calcula automáticamente según las filas
                    </Text>
                  </View>
                </View>

                {/* Configuración de Filas */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">
                  Configuración de Filas
                </Text>

                <View className="rounded-2xl bg-gray-800/30 p-4">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-white">
                      Filas ({filas.length})
                    </Text>
                    <Pressable
                      onPress={addFila}
                      className="flex-row items-center rounded-full bg-gray-700 px-3 py-2">
                      <Plus size={16} color="#9CA3AF" />
                      <Text className="ml-2 text-sm font-medium text-white">Agregar Fila</Text>
                    </Pressable>
                  </View>

                  {filas.length === 0 ? (
                    <View className="items-center py-8">
                      <Grid3X3 size={32} color="#6B7280" />
                      <Text className="mt-2 text-sm text-gray-400">No hay filas configuradas</Text>
                      <Text className="text-xs text-gray-500">
                        Agrega al menos una fila para continuar
                      </Text>
                    </View>
                  ) : (
                    <View className="space-y-3">
                      {filas.map((fila, index) => (
                        <View key={index} className="rounded-xl bg-gray-700/30 p-4">
                          <View className="mb-3 flex-row items-center justify-between">
                            <Text className="text-base font-medium text-white">
                              Fila {fila.letra}
                            </Text>
                            <Pressable
                              onPress={() => removeFila(index)}
                              className="rounded-full bg-red-500/10 p-2">
                              <Trash2 size={16} color="#EF4444" />
                            </Pressable>
                          </View>

                          <View className="flex-row space-x-3">
                            <View className="flex-1">
                              <Text className="mb-1 text-xs font-medium text-gray-400">Letra</Text>
                              <View className="overflow-hidden rounded-xl bg-gray-800">
                                <TextInput
                                  value={fila.letra}
                                  onChangeText={(text) =>
                                    updateFila(index, { ...fila, letra: text.toUpperCase() })
                                  }
                                  placeholder="A"
                                  placeholderTextColor="#9CA3AF"
                                  className="px-3 py-2 text-white"
                                  maxLength={2}
                                />
                              </View>
                            </View>

                            <View className="flex-1">
                              <Text className="mb-1 text-xs font-medium text-gray-400">
                                Asientos
                              </Text>
                              <View className="overflow-hidden rounded-xl bg-gray-800">
                                <TextInput
                                  value={fila.cantidad_asientos.toString()}
                                  onChangeText={(text) => {
                                    const cantidad = parseInt(text) || 0;
                                    updateFila(index, { ...fila, cantidad_asientos: cantidad });
                                  }}
                                  placeholder="10"
                                  placeholderTextColor="#9CA3AF"
                                  className="px-3 py-2 text-white"
                                  keyboardType="numeric"
                                />
                              </View>
                            </View>

                            <View className="flex-1">
                              <Text className="mb-1 text-xs font-medium text-gray-400">Tipo</Text>
                              <View className="overflow-hidden rounded-xl bg-gray-800">
                                <Pressable
                                  onPress={() => {
                                    const currentIndex = tiposFila.indexOf(fila.tipo_fila);
                                    const nextIndex = (currentIndex + 1) % tiposFila.length;
                                    updateFila(index, { ...fila, tipo_fila: tiposFila[nextIndex] });
                                  }}
                                  className="px-3 py-2">
                                  <Text className="text-sm text-white">{fila.tipo_fila}</Text>
                                </Pressable>
                              </View>
                            </View>
                          </View>

                          <View className="mt-3">
                            <Text className="mb-1 text-xs font-medium text-gray-400">
                              Multiplicador de Precio ({fila.precio_multiplicador}x)
                            </Text>
                            <View className="overflow-hidden rounded-xl bg-gray-800">
                              <TextInput
                                value={fila.precio_multiplicador.toString()}
                                onChangeText={(text) => {
                                  const multiplicador = parseFloat(text) || 1.0;
                                  updateFila(index, {
                                    ...fila,
                                    precio_multiplicador: multiplicador,
                                  });
                                }}
                                placeholder="1.0"
                                placeholderTextColor="#9CA3AF"
                                className="px-3 py-2 text-white"
                                keyboardType="decimal-pad"
                              />
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Información adicional para edición */}
                {editingSala && (
                  <View className="mt-6 rounded-2xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información de la Sala
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingSala.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingSala.activa ? 'Activa' : 'Inactiva'}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mb-6 mt-6 flex-row space-x-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 rounded-2xl bg-gray-800 px-4 py-3">
                <Text className="text-center font-bold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={
                  formLoading ||
                  !formData.nombre.trim() ||
                  formData.cine_id === 0 ||
                  filas.length === 0
                }
                className={`flex-1 rounded-2xl px-4 py-3 ${
                  formLoading ||
                  !formData.nombre.trim() ||
                  formData.cine_id === 0 ||
                  filas.length === 0
                    ? 'bg-gray-600'
                    : 'bg-white'
                }`}>
                {formLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <Save
                      size={16}
                      color={
                        formLoading ||
                        !formData.nombre.trim() ||
                        formData.cine_id === 0 ||
                        filas.length === 0
                          ? '#ffffff'
                          : '#000000'
                      }
                    />
                    <Text
                      className={`ml-2 font-bold ${formLoading || !formData.nombre.trim() || formData.cine_id === 0 || filas.length === 0 ? 'text-white' : 'text-black'}`}>
                      {editingSala ? 'Actualizar' : 'Crear'}
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
