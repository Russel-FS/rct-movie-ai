import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Cines from '~/home/page/Cines';
import Entradas from '~/home/page/Entradas';
import Perfil from '~/home/page/Perfil';
import Home from '~/home/page/Home';

interface NavItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  page?: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'home', name: 'Home', icon: 'home-outline', label: 'Inicio', page: <Home /> },
  { id: 'Cines', name: 'Cines', icon: 'location-outline', label: 'Cines', page: <Cines /> },
  { id: 'entries', name: 'Entries', icon: 'ticket-outline', label: 'Entradas', page: <Entradas /> },
  { id: 'profile', name: 'Profile', icon: 'person-outline', label: 'Perfil', page: <Perfil /> },
];

export default function Navigation() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <View className=" flex-row border-t border-gray-700 bg-gray-900 px-4 py-2">
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="flex-1 items-center justify-center py-2"
          onPress={() => handleTabPress(item.id)}
          activeOpacity={0.7}>
          <Ionicons name={item.icon} size={24} color={activeTab === item.id ? 'white' : 'gray'} />
          <Text
            className={`mt-1 text-xs font-semibold ${
              activeTab === item.id ? 'text-white' : 'text-gray-400'
            }`}>
            {item.label}
          </Text>
          {activeTab === item.id ? item.page : <Home />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
