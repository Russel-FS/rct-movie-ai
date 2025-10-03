import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Film, Ticket } from 'lucide-react-native';
import { MainTabParamList } from '~/shared/types/navigation';

import HomeScreen from '~/home/page/Home';
import CarteleraScreen from '~/cartelera/pages/Cartelera';
import MisEntradasScreen from '~/tickets/pages/MisEntradas';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: 'rgba(55, 65, 81, 0.3)',
          borderTopWidth: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          height: 80,
          borderRadius: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 6,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Home color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Cartelera"
        component={CarteleraScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Film color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="MisEntradas"
        component={MisEntradasScreen}
        options={{
          tabBarLabel: 'Mis Entradas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ticket color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
