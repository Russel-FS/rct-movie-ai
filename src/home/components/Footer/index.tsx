import { Home, Search, Heart, User } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Footer = () => {
  // Datos de los botones del footer. En el futuro, esto podría venir de tu configuración de navegación.
  const navButtons = [
    { icon: Home, label: 'Inicio' },
    { icon: Search, label: 'Buscar' },
    { icon: Heart, label: 'Favoritos' },
    { icon: User, label: 'Perfil' },
  ];

  return (
    // Contenedor principal del footer
    <View className="w-full h-16 bg-gray-100 border-t border-gray-300 flex-row justify-around items-center">
      {navButtons.map((button, index) => (
        <TouchableOpacity
          key={index}
          className="flex-1 items-center justify-center"
          onPress={() => alert(`Navegar a ${button.label}`)} // Por ahora, solo muestra una alerta
        >
          {/* Usamos el componente de ícono que pasamos en el objeto */}
          <button.icon color="black" size={24} />
          <Text className="text-xs mt-1">{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Footer;