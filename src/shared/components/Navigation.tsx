import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { User, Home, MapPin, Ticket, User2, Film } from 'lucide-react-native';

export interface NavItem {
  id: string;
  name: string;
  icon: ({ color, size }: { color: string; size: number }) => React.ReactNode;
  label: string;
  page?: React.ReactNode;
}

interface NavigationProps {
  onTabChange?: (tabId: string) => void;
  initialTab?: string;
}

export default function Navigation({ onTabChange, initialTab = 'home' }: NavigationProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const navItems: NavItem[] = [
    { id: 'home', name: 'Home', icon: (props) => <Home {...props} />, label: 'Inicio' },
    {
      id: 'cartelera',
      name: 'Cartelera',
      icon: (props) => <Film {...props} />,
      label: 'Cartelera',
    },
    { id: 'Cines', name: 'Cines', icon: (props) => <MapPin {...props} />, label: 'Cines' },
    { id: 'entries', name: 'Entries', icon: (props) => <Ticket {...props} />, label: 'Entradas' },
    { id: 'auth', name: 'Auth', icon: (props) => <User {...props} />, label: 'Acceso' },
    { id: 'profile', name: 'Profile', icon: (props) => <User2 {...props} />, label: 'Perfil' },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <View className="flex-row border-t border-gray-700 bg-gray-900 px-4 py-2">
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="flex-1 items-center justify-center py-2"
          onPress={() => handleTabPress(item.id)}
          activeOpacity={0.7}>
          {item.icon({ color: activeTab === item.id ? 'white' : 'gray', size: 24 })}
          <Text
            className={`mt-1 text-xs font-semibold ${
              activeTab === item.id ? 'text-white' : 'text-gray-400'
            }`}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
