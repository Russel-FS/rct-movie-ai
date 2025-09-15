import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthNavigationProps {
  onTabChange?: (tabId: string) => void;
  initialTab?: string;
}

export default function AuthNavigation({ onTabChange, initialTab = 'login' }: AuthNavigationProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const navItems = [
    { id: 'login', label: 'Iniciar Sesión' },
    { id: 'register', label: 'Registrarse' },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <View className="flex-row mb-6">
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          className={`flex-1 py-3 ${activeTab === item.id ? 'border-b-2 border-blue-500' : 'border-b border-gray-700'}`}
          onPress={() => handleTabPress(item.id)}
          activeOpacity={0.7}>
          <Text
            className={`text-center font-semibold ${activeTab === item.id ? 'text-blue-500' : 'text-gray-400'}`}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}