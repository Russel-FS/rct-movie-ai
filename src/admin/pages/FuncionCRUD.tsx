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
import { Calendar, DateData } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Plus,
  Search,
  X,
  Save,
  RotateCcw,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  ChevronRight,
  ChevronDown,
  Check,
  Trash2,
  MapPin,
  Film,
  Users,
  Star,
  Play,
} from 'lucide-react-native';

import { Funcion, CreateFuncionDto, UpdateFuncionDto, Formato } from '~/shared/types/funcion';
import { Pelicula } from '~/shared/types/pelicula';
import { Sala } from '~/shared/types/sala';
import { FuncionService } from '~/shared/services/funcion.service';
import { usePeliculas } from '~/shared/hooks/usePeliculas';
import { SalaService } from '~/shared/services/sala.service';
import { useFunciones } from '~/shared/hooks/useFunciones';

const formatos: Formato[] = ['2D', '3D', 'IMAX'];

export default function FuncionCRUD() {
  // Estados principales
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedPelicula, setSelectedPelicula] = useState<string | null>(null);

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFuncion, setEditingFuncion] = useState<Funcion | null>(null);
  const [formData, setFormData] = useState<CreateFuncionDto>({
    pelicula_id: '',
    sala_id: 0,
    fecha_hora: '',
    precio_base: 0,
    precio_vip: 0,
    subtitulada: false,
    doblada: false,
    formato: '2D',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Estados para selectores
  const [showPeliculaSelector, setShowPeliculaSelector] = useState(false);
  const [showSalaSelector, setShowSalaSelector] = useState(false);
  const [showFormatoSelector, setShowFormatoSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dateTimeValue, setDateTimeValue] = useState(new Date());

  // Hooks
  const { peliculas } = usePeliculas();
  const { funciones, refreshFunciones } = useFunciones({
    peliculaId: selectedPelicula || undefined,
    incluirInactivas: showInactive,
  });

  // Cargar salas
  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    try {
      const salasData = await SalaService.getAllSalas(true);
      setSalas(salasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las salas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar funciones por búsqueda
  const filteredFunciones = funciones.filter(
    (funcion) =>
      funcion.pelicula?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcion.sala?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcion.formato.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear función
  const openCreateModal = () => {
    setEditingFuncion(null);
    const today = new Date();
    today.setHours(20, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];
    setSelectedDate(todayString);
    setSelectedTime('20:00');
    setDateTimeValue(today);
    setFormData({
      pelicula_id: selectedPelicula || '',
      sala_id: 0,
      fecha_hora: today.toISOString(),
      precio_base: 0,
      precio_vip: 0,
      subtitulada: false,
      doblada: false,
      formato: '2D',
    });
    setModalVisible(true);
  };

  // Abrir modal para editar función
  const openEditModal = (funcion: Funcion) => {
    setEditingFuncion(funcion);
    const fechaExistente = new Date(funcion.fecha_hora);
    setSelectedDate(fechaExistente.toISOString().split('T')[0]);
    setSelectedTime(fechaExistente.toTimeString().slice(0, 5));
    setDateTimeValue(fechaExistente);
    setFormData({
      pelicula_id: funcion.pelicula_id,
      sala_id: funcion.sala_id,
      fecha_hora: funcion.fecha_hora,
      precio_base: funcion.precio_base,
      precio_vip: funcion.precio_vip || 0,
      subtitulada: funcion.subtitulada,
      doblada: funcion.doblada,
      formato: funcion.formato,
    });
    setModalVisible(true);
  };

  // Guardar función
  const handleSave = async () => {
    if (!formData.pelicula_id) {
      Alert.alert('Error', 'Selecciona una película');
      return;
    }

    if (formData.sala_id === 0) {
      Alert.alert('Error', 'Selecciona una sala');
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Selecciona la fecha y hora');
      return;
    }

    if (formData.precio_base <= 0) {
      Alert.alert('Error', 'Ingresa un precio base válido');
      return;
    }

    try {
      setFormLoading(true);

      if (editingFuncion) {
        await FuncionService.updateFuncion(editingFuncion.id, formData as UpdateFuncionDto);
        Alert.alert('Éxito', 'Función actualizada correctamente');
      } else {
        await FuncionService.createFuncion(formData);
        Alert.alert('Éxito', 'Función creada correctamente');
      }

      setModalVisible(false);
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowPeliculaSelector(false);
      setShowSalaSelector(false);
      setShowFormatoSelector(false);
      refreshFunciones();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || `No se pudo ${editingFuncion ? 'actualizar' : 'crear'} la función`
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Cambiar estado de función
  const toggleFuncionStatus = async (funcion: Funcion) => {
    try {
      await FuncionService.toggleFuncionStatus(funcion.id, !funcion.activa);
      refreshFunciones();
      Alert.alert('Éxito', `Función ${!funcion.activa ? 'activada' : 'desactivada'} correctamente`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado de la función');
    }
  };

  // Manejar selección de fecha del calendario
  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
    const currentDateTime = new Date(dateTimeValue);
    const newDateTime = new Date(day.dateString);
    newDateTime.setHours(currentDateTime.getHours(), currentDateTime.getMinutes());
    setDateTimeValue(newDateTime);
    updateFechaHora(newDateTime);
    setShowDatePicker(false);
  };

  // Manejar cambio de fecha
  const handleDateTimeChange = (event: any, selectedDateTime?: Date) => {
    if (selectedDateTime) {
      setDateTimeValue(selectedDateTime);

      if (showDatePicker) {
        const dateString = selectedDateTime.toISOString().split('T')[0];
        setSelectedDate(dateString);
        setShowDatePicker(false);
      }

      if (showTimePicker) {
        const timeString = selectedDateTime.toTimeString().slice(0, 5);
        setSelectedTime(timeString);
        setShowTimePicker(false);
      }
      updateFechaHora(selectedDateTime);
    } else {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  };

  // Actualizar fecha_hora en formData
  const updateFechaHora = (dateTime: Date) => {
    const fechaHora = dateTime.toISOString();
    setFormData({ ...formData, fecha_hora: fechaHora });
  };

  // Formatear fecha y hora para mostrar
  const formatearFechaHora = (fechaHora: string) => {
    const fecha = new Date(fechaHora);
    return {
      fecha: fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      hora: fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // Componente de tarjeta de función
  const FuncionCard = ({ funcion }: { funcion: Funcion }) => {
    const { fecha, hora } = formatearFechaHora(funcion.fecha_hora);
    const sala = salas.find((s) => s.id === funcion.sala_id);

    return (
      <TouchableOpacity
        className="mb-4 overflow-hidden rounded-3xl bg-gray-800/50"
        onPress={() => openEditModal(funcion)}
        activeOpacity={0.8}>
        <View className="p-6">
          {/* Header con película */}
          <View className="mb-4 flex-row items-start">
            <View className="mr-4 h-16 w-12 overflow-hidden rounded-xl bg-gray-700">
              {funcion.pelicula?.poster_url && (
                <Image
                  source={{ uri: funcion.pelicula.poster_url }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              )}
            </View>
            <View className="flex-1">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="text-base font-bold text-white" numberOfLines={1}>
                  {funcion.pelicula?.titulo || 'Película no encontrada'}
                </Text>
                <Text className="ml-3 text-xs text-gray-400">#{funcion.id.slice(-6)}</Text>
              </View>

              <View className="mb-2 flex-row items-center space-x-3">
                <View className="rounded-full bg-blue-500/10 px-2 py-1">
                  <Text className="text-xs font-medium text-blue-400">{funcion.formato}</Text>
                </View>

                {funcion.subtitulada && (
                  <View className="rounded-full bg-green-500/10 px-2 py-1">
                    <Text className="text-xs font-medium text-green-400">SUB</Text>
                  </View>
                )}

                {funcion.doblada && (
                  <View className="rounded-full bg-purple-500/10 px-2 py-1">
                    <Text className="text-xs font-medium text-purple-400">DOB</Text>
                  </View>
                )}

                {!funcion.activa && (
                  <View className="rounded-full bg-red-500/10 px-2 py-1">
                    <Text className="text-xs font-medium text-red-400">Inactiva</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Información de sala y cine */}
          <View className="mb-4 rounded-2xl bg-gray-700/30 p-4">
            <View className="mb-2 flex-row items-center">
              <MapPin size={14} color="#6B7280" />
              <Text className="ml-2 text-sm font-medium text-gray-300">
                {sala?.cine?.nombre || 'Cine no encontrado'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Users size={14} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-400">
                Sala {funcion.sala?.nombre} • {funcion.sala?.capacidad} asientos •{' '}
                {funcion.sala?.tipo}
              </Text>
            </View>
          </View>

          {/* Footer con fecha, hora y precios */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <CalendarIcon size={14} color="#6B7280" />
                <Text className="ml-2 text-sm font-medium text-gray-300">{fecha}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={14} color="#6B7280" />
                <Text className="ml-2 text-sm font-medium text-gray-300">{hora}</Text>
              </View>
            </View>

            <View className="flex-row items-center space-x-3">
              <View className="flex-row items-center">
                <DollarSign size={14} color="#10B981" />
                <Text className="ml-1 text-sm font-bold text-green-400">
                  S/ {funcion.precio_base.toFixed(2)}
                </Text>
              </View>
              {funcion.precio_vip && funcion.precio_vip > 0 && (
                <View className="flex-row items-center">
                  <Star size={14} color="#F59E0B" />
                  <Text className="ml-1 text-sm font-bold text-yellow-400">
                    S/ {funcion.precio_vip.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Cargando funciones...</Text>
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
              <Text className="text-2xl font-bold text-white">Funciones de Cine</Text>
            </View>
            <Pressable onPress={refreshFunciones} className="rounded-full bg-gray-800/50 p-3">
              <RotateCcw size={20} color="#9CA3AF" />
            </Pressable>
          </View>

          {/* Filtro por película */}
          <View className="mt-6">
            <Text className="mb-4 text-xl font-bold text-white">Filtrar por Película</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <Pressable
                onPress={() => setSelectedPelicula(null)}
                className={`mr-3 rounded-3xl px-5 py-3 ${
                  selectedPelicula === null ? 'bg-white' : 'bg-gray-800/50'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    selectedPelicula === null ? 'text-black' : 'text-gray-300'
                  }`}>
                  Todas las películas
                </Text>
              </Pressable>
              {peliculas.map((pelicula) => (
                <Pressable
                  key={pelicula.id}
                  onPress={() => setSelectedPelicula(pelicula.id)}
                  className={`mr-3 rounded-3xl px-5 py-3 ${
                    selectedPelicula === pelicula.id ? 'bg-white' : 'bg-gray-800/50'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      selectedPelicula === pelicula.id ? 'text-black' : 'text-gray-300'
                    }`}>
                    {pelicula.titulo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Configuración */}
          <Text className="mb-6 mt-8 text-xl font-bold text-white">Configuración</Text>

          <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-6">
            <View className="flex-1">
              <Text className="text-base font-medium text-white">Mostrar funciones inactivas</Text>
              <Text className="text-sm text-gray-400">
                {filteredFunciones.length} función{filteredFunciones.length !== 1 ? 'es' : ''}{' '}
                encontrada
                {filteredFunciones.length !== 1 ? 's' : ''}
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
                placeholder="Buscar funciones por película, sala o formato..."
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
          {/* Lista de funciones */}
          <Text className="mb-6 text-xl font-bold text-white">Funciones Programadas</Text>

          {filteredFunciones.length > 0 ? (
            filteredFunciones.map((funcion) => <FuncionCard key={funcion.id} funcion={funcion} />)
          ) : (
            <View className="items-center rounded-3xl bg-gray-800/30 p-8">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-700/50">
                <Film size={32} color="#9CA3AF" />
              </View>
              <Text className="mb-2 text-xl font-bold text-white">
                {searchTerm ? 'No se encontraron funciones' : 'No hay funciones programadas'}
              </Text>
              <Text className="mb-6 text-center text-sm text-gray-400">
                {searchTerm
                  ? 'Intenta con otro término de búsqueda o ajusta los filtros'
                  : 'Comienza programando tu primera función de cine'}
              </Text>
              {!searchTerm && (
                <Pressable
                  onPress={openCreateModal}
                  className="overflow-hidden rounded-3xl bg-white px-6 py-3">
                  <View className="flex-row items-center">
                    <Plus size={20} color="#000000" />
                    <Text className="ml-2 font-semibold text-black">Crear Primera Función</Text>
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
                {editingFuncion ? 'Editar Función' : 'Nueva Función'}
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                  setShowPeliculaSelector(false);
                  setShowSalaSelector(false);
                  setShowFormatoSelector(false);
                }}
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

                {/* Película */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Película *</Text>
                  <Pressable
                    onPress={() => setShowPeliculaSelector(!showPeliculaSelector)}
                    className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                    <Text className="text-white">
                      {formData.pelicula_id
                        ? peliculas.find((p) => p.id === formData.pelicula_id)?.titulo
                        : 'Seleccionar película'}
                    </Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </Pressable>

                  {showPeliculaSelector && (
                    <View className="mt-2 max-h-48 overflow-hidden rounded-2xl bg-gray-800/30">
                      <ScrollView>
                        {peliculas.map((pelicula) => (
                          <Pressable
                            key={pelicula.id}
                            onPress={() => {
                              setFormData({ ...formData, pelicula_id: pelicula.id });
                              setShowPeliculaSelector(false);
                            }}
                            className="flex-row items-center justify-between px-4 py-3">
                            <Text className="text-white">{pelicula.titulo}</Text>
                            {formData.pelicula_id === pelicula.id && (
                              <Check size={16} color="#9CA3AF" />
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Sala */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Sala *</Text>
                  <Pressable
                    onPress={() => setShowSalaSelector(!showSalaSelector)}
                    className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                    <Text className="text-white">
                      {formData.sala_id
                        ? `${salas.find((s) => s.id === formData.sala_id)?.nombre} - ${salas.find((s) => s.id === formData.sala_id)?.cine?.nombre}`
                        : 'Seleccionar sala'}
                    </Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </Pressable>

                  {showSalaSelector && (
                    <View className="mt-2 max-h-48 overflow-hidden rounded-2xl bg-gray-800/30">
                      <ScrollView>
                        {salas.map((sala) => (
                          <Pressable
                            key={sala.id}
                            onPress={() => {
                              setFormData({ ...formData, sala_id: sala.id });
                              setShowSalaSelector(false);
                            }}
                            className="px-4 py-3">
                            <View className="flex-row items-center justify-between">
                              <View className="flex-1">
                                <Text className="text-white">{sala.nombre}</Text>
                                <Text className="text-xs text-gray-400">
                                  {sala.cine?.nombre} • {sala.capacidad} asientos • {sala.tipo}
                                </Text>
                              </View>
                              {formData.sala_id === sala.id && <Check size={16} color="#9CA3AF" />}
                            </View>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Fecha y Hora */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Fecha y Hora</Text>

                <View className="flex-row gap-3">
                  {/* Selector de Fecha */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Fecha *</Text>
                    <Pressable
                      onPress={() => setShowDatePicker(!showDatePicker)}
                      className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                      <Text className="text-white">
                        {selectedDate
                          ? new Date(selectedDate).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Seleccionar fecha'}
                      </Text>
                      <CalendarIcon size={20} color="#9CA3AF" />
                    </Pressable>
                  </View>

                  {/* Selector de Hora */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Hora *</Text>
                    <Pressable
                      onPress={() => setShowTimePicker(!showTimePicker)}
                      className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                      <Text className="text-white">{selectedTime || 'Seleccionar hora'}</Text>
                      <Clock size={20} color="#9CA3AF" />
                    </Pressable>
                  </View>
                </View>

                {/* Calendar Picker */}
                {showDatePicker && (
                  <View className="mt-4 overflow-hidden rounded-2xl bg-gray-800/30">
                    <Calendar
                      onDayPress={handleDateSelect}
                      markedDates={{
                        [selectedDate]: {
                          selected: true,
                          selectedColor: '#FFFFFF',
                          selectedTextColor: '#000000',
                        },
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                      theme={{
                        backgroundColor: 'transparent',
                        calendarBackground: 'transparent',
                        textSectionTitleColor: '#9CA3AF',
                        selectedDayBackgroundColor: '#FFFFFF',
                        selectedDayTextColor: '#000000',
                        todayTextColor: '#3B82F6',
                        dayTextColor: '#FFFFFF',
                        textDisabledColor: '#4B5563',
                        dotColor: '#FFFFFF',
                        selectedDotColor: '#000000',
                        arrowColor: '#FFFFFF',
                        disabledArrowColor: '#4B5563',
                        monthTextColor: '#FFFFFF',
                        indicatorColor: '#FFFFFF',
                        textDayFontFamily: 'System',
                        textMonthFontFamily: 'System',
                        textDayHeaderFontFamily: 'System',
                        textDayFontWeight: '400',
                        textMonthFontWeight: '700',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 14,
                      }}
                    />
                  </View>
                )}

                {/* picker de fecha */}
                {showDatePicker && (
                  <DateTimePicker
                    value={dateTimeValue}
                    mode="date"
                    display="default"
                    onChange={handleDateTimeChange}
                    minimumDate={new Date()}
                  />
                )}

                {/* picker de hora */}
                {showTimePicker && (
                  <DateTimePicker
                    value={dateTimeValue}
                    mode="time"
                    display="default"
                    onChange={handleDateTimeChange}
                    is24Hour={true}
                  />
                )}

                {/* Precios */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Precio Base *</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.precio_base.toString()}
                        onChangeText={(text) => {
                          const precio = parseFloat(text) || 0;
                          setFormData({ ...formData, precio_base: precio });
                        }}
                        placeholder="15.00"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-bold text-white">Precio VIP</Text>
                    <View className="overflow-hidden rounded-3xl bg-gray-800/50">
                      <TextInput
                        value={formData.precio_vip?.toString() || ''}
                        onChangeText={(text) => {
                          const precio = parseFloat(text) || 0;
                          setFormData({ ...formData, precio_vip: precio });
                        }}
                        placeholder="25.00"
                        placeholderTextColor="#9CA3AF"
                        className="px-4 py-3 text-white"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                </View>

                {/* Formato */}
                <View>
                  <Text className="mb-2 text-sm font-bold text-white">Formato *</Text>
                  <Pressable
                    onPress={() => setShowFormatoSelector(!showFormatoSelector)}
                    className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 px-4 py-3">
                    <Text className="text-white">{formData.formato}</Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </Pressable>

                  {showFormatoSelector && (
                    <View className="mt-2 overflow-hidden rounded-2xl bg-gray-800/30">
                      {formatos.map((formato) => (
                        <Pressable
                          key={formato}
                          onPress={() => {
                            setFormData({ ...formData, formato });
                            setShowFormatoSelector(false);
                          }}
                          className="flex-row items-center justify-between px-4 py-3">
                          <Text className="text-white">{formato}</Text>
                          {formData.formato === formato && <Check size={16} color="#9CA3AF" />}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Opciones de audio */}
                <Text className="mb-4 mt-6 text-lg font-bold text-white">Opciones de Audio</Text>

                <View className="flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-4">
                  <Text className="text-base font-medium text-white">Subtitulada</Text>
                  <Switch
                    value={formData.subtitulada}
                    onValueChange={(value) => setFormData({ ...formData, subtitulada: value })}
                    trackColor={{ false: '#374151', true: '#FFFFFF' }}
                    thumbColor={formData.subtitulada ? '#000000' : '#9CA3AF'}
                  />
                </View>

                <View className="mt-2 flex-row items-center justify-between rounded-3xl bg-gray-800/50 p-4">
                  <Text className="text-base font-medium text-white">Doblada</Text>
                  <Switch
                    value={formData.doblada}
                    onValueChange={(value) => setFormData({ ...formData, doblada: value })}
                    trackColor={{ false: '#374151', true: '#FFFFFF' }}
                    thumbColor={formData.doblada ? '#000000' : '#9CA3AF'}
                  />
                </View>

                {/* Información adicional para edición */}
                {editingFuncion && (
                  <View className="mt-6 rounded-2xl bg-gray-800/30 p-4">
                    <Text className="mb-2 text-sm font-bold text-gray-400">
                      Información de la Función
                    </Text>
                    <Text className="text-xs text-gray-300">ID: {editingFuncion.id}</Text>
                    <Text className="text-xs text-gray-300">
                      Estado: {editingFuncion.activa ? 'Activa' : 'Inactiva'}
                    </Text>
                    <Text className="text-xs text-gray-300">
                      Asientos disponibles: {editingFuncion.asientos_disponibles || 'N/A'}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Botones */}
            <View className="mb-6 mt-6 flex-row gap-3">
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                  setShowPeliculaSelector(false);
                  setShowSalaSelector(false);
                  setShowFormatoSelector(false);
                }}
                className="flex-1 rounded-3xl bg-gray-800/50 px-6 py-4">
                <Text className="text-center text-base font-semibold text-white">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                disabled={
                  formLoading ||
                  !formData.pelicula_id ||
                  formData.sala_id === 0 ||
                  !selectedDate ||
                  !selectedTime ||
                  formData.precio_base <= 0
                }
                className={`flex-1 rounded-3xl px-6 py-4 ${
                  formLoading ||
                  !formData.pelicula_id ||
                  formData.sala_id === 0 ||
                  !selectedDate ||
                  !selectedTime ||
                  formData.precio_base <= 0
                    ? 'bg-gray-600/50'
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
                        !formData.pelicula_id ||
                        formData.sala_id === 0 ||
                        !selectedDate ||
                        !selectedTime ||
                        formData.precio_base <= 0
                          ? '#ffffff'
                          : '#000000'
                      }
                    />
                    <Text
                      className={`ml-2 text-base font-semibold ${
                        formLoading ||
                        !formData.pelicula_id ||
                        formData.sala_id === 0 ||
                        !selectedDate ||
                        !selectedTime ||
                        formData.precio_base <= 0
                          ? 'text-white'
                          : 'text-black'
                      }`}>
                      {editingFuncion ? 'Actualizar Función' : 'Crear Función'}
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
