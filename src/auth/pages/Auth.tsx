import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { User } from 'lucide-react-native';
import AuthNavigation from '../components/AuthNavigation';
import Login from './Login';
import Register from './Register';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<string>('login');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="px-4 py-6">
        <View className="mb-6 flex-row items-center">
          <User size={24} color="white" />
          <Text className="ml-2 text-2xl font-bold text-white">Autenticación</Text>
        </View>

        {/* Navegación entre login y registro */}
        <AuthNavigation onTabChange={handleTabChange} initialTab={activeTab} />

        {/* Contenido según la pestaña seleccionada */}
        {renderContent()}
      </View>
    </ScrollView>
  );
}