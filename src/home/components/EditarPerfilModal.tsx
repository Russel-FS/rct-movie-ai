import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { X, Save, User, Phone, Calendar } from 'lucide-react-native';
import { useAuth } from '~/shared/contexts/AuthContext';

interface EditarPerfilModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditarPerfilModal({ visible, onClose, onSave }: EditarPerfilModalProps) {
  const { usuario, updateUsuario } = useAuth();

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    fecha_nacimiento: usuario?.fecha_nacimiento || '',
    genero: usuario?.genero || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      Alert.alert('Error', 'El nombre y apellido son obligatorios');
      return;
    }

    try {
      setLoading(true);

      const updateData: any = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
      };

      if (formData.telefono.trim()) {
        updateData.telefono = formData.telefono.trim();
      }

      if (formData.fecha_nacimiento) {
        updateData.fecha_nacimiento = formData.fecha_nacimiento;
      }

      if (formData.genero) {
        updateData.genero = formData.genero;
      }

      const success = await updateUsuario(updateData);

      if (success) {
        Alert.alert('Éxito', 'Información actualizada correctamente');
        onSave();
        onClose();
      } else {
        Alert.alert('Error', 'No se pudo actualizar la información');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'Ocurrió un error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: usuario?.nombre || '',
      apellido: usuario?.apellido || '',
      telefono: usuario?.telefono || '',
      fecha_nacimiento: usuario?.fecha_nacimiento || '',
      genero: usuario?.genero || '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View className="flex-1 bg-black/50">
        <View className="mt-12 flex-1 rounded-t-3xl bg-black px-6 py-6">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Editar Perfil</Text>
            <TouchableOpacity onPress={handleClose} className="rounded-full bg-gray-800/50 p-2">
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Nombre */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-bold text-white">Nombre *</Text>
              <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
                <User size={16} color="#9CA3AF" />
                <TextInput
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  placeholder="Tu nombre"
                  placeholderTextColor="#9CA3AF"
                  className="ml-3 flex-1 text-white"
                />
              </View>
            </View>

            {/* Apellido */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-bold text-white">Apellido *</Text>
              <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
                <User size={16} color="#9CA3AF" />
                <TextInput
                  value={formData.apellido}
                  onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                  placeholder="Tu apellido"
                  placeholderTextColor="#9CA3AF"
                  className="ml-3 flex-1 text-white"
                />
              </View>
            </View>

            {/* Teléfono */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-bold text-white">Teléfono</Text>
              <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
                <Phone size={16} color="#9CA3AF" />
                <TextInput
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                  placeholder="+51 999 999 999"
                  placeholderTextColor="#9CA3AF"
                  className="ml-3 flex-1 text-white"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Fecha de nacimiento */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-bold text-white">Fecha de Nacimiento</Text>
              <View className="flex-row items-center rounded-3xl bg-gray-800/50 px-4 py-3">
                <Calendar size={16} color="#9CA3AF" />
                <TextInput
                  value={formData.fecha_nacimiento}
                  onChangeText={(text) => setFormData({ ...formData, fecha_nacimiento: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                  className="ml-3 flex-1 text-white"
                />
              </View>
              <Text className="mt-1 text-xs text-gray-400">
                Formato: Año-Mes-Día (ej: 1990-12-25)
              </Text>
            </View>

            {/* Género */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-bold text-white">Género</Text>
              <View className="flex-row space-x-3">
                {['M', 'F', 'Otro'].map((genero) => (
                  <TouchableOpacity
                    key={genero}
                    onPress={() => setFormData({ ...formData, genero })}
                    className={`flex-1 rounded-2xl px-4 py-3 ${
                      formData.genero === genero ? 'bg-white' : 'bg-gray-800/50'
                    }`}>
                    <Text
                      className={`text-center text-sm font-medium ${
                        formData.genero === genero ? 'text-black' : 'text-white'
                      }`}>
                      {genero === 'M' ? 'Masculino' : genero === 'F' ? 'Femenino' : 'Otro'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Información del email */}
            <View className="mb-6 rounded-2xl bg-blue-500/10 p-4">
              <Text className="mb-1 text-sm font-medium text-blue-400">Información</Text>
              <Text className="text-xs text-gray-300">
                El email no se puede cambiar desde aquí. Si necesitas cambiarlo, contacta con
                soporte.
              </Text>
            </View>
          </ScrollView>

          {/* Botones */}
          <View className="flex-row space-x-3 pt-4">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 rounded-3xl bg-gray-800/50 px-6 py-4">
              <Text className="text-center text-base font-semibold text-white">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading || !formData.nombre.trim() || !formData.apellido.trim()}
              className={`flex-1 rounded-3xl px-6 py-4 ${
                loading || !formData.nombre.trim() || !formData.apellido.trim()
                  ? 'bg-gray-600/50'
                  : 'bg-white'
              }`}>
              {loading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Save size={16} color="#000000" />
                  <Text className="ml-2 text-base font-semibold text-black">Guardar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
