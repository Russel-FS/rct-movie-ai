import { UserIcon, X, Settings, LogOut, Menu } from 'lucide-react-native';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal } from 'react-native';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <View className="w-full flex-row items-center justify-between rounded-lg bg-gray-900 p-4">
      <TouchableOpacity className="rounded-full bg-white p-1.5" onPress={() => setIsOpen(!isOpen)}>
        <Menu color={'black'} size={24} />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-white">Movie AI</Text>
      <TouchableOpacity className="rounded-full bg-white p-1.5" onPress={() => setIsOpen(!isOpen)}>
        <UserIcon color={'black'} size={24} />
      </TouchableOpacity>
      <Modal isVisible={isOpen} onClose={handleClose} />
    </View>
  );
};

const Modal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  return (
    <RNModal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        className="flex-1 items-center justify-center bg-black/50"
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          className="mx-4 w-80 rounded-lg bg-white p-6"
          activeOpacity={1}
          onPress={() => {}}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-800">Perfil</Text>
            <TouchableOpacity onPress={onClose}>
              <X color={'#374151'} size={20} />
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center rounded-lg bg-gray-50 p-3">
              <Settings color={'#374151'} size={20} />
              <Text className="ml-3 text-gray-700">Configuración</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center rounded-lg bg-gray-50 p-3">
              <LogOut color={'#dc2626'} size={20} />
              <Text className="ml-3 text-red-600">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};
export default Header;
