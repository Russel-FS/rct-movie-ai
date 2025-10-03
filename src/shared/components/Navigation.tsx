import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { Home, Film, Ticket, User } from 'lucide-react-native';
import { MainTabParamList } from '~/shared/types/navigation';

import HomeScreen from '~/home/page/Home';
import CarteleraScreen from '~/cartelera/pages/Cartelera';
import MisEntradasScreen from '~/tickets/pages/MisEntradas';
import PerfilScreen from '~/home/page/Perfil';
import AuthRequired from './AuthRequired';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabBarIcon = ({
  focused,
  icon: Icon,
  color,
}: {
  focused: boolean;
  icon: any;
  color: string;
}) => {
  return (
    <View className={`items-center justify-center ${focused ? 'mt-1' : 'mt-2'}`}>
      <View
        className={`items-center justify-center rounded-full ${focused ? 'bg-white p-2' : 'p-1'}`}>
        <Icon size={focused ? 22 : 20} color={focused ? '#000' : color} strokeWidth={2} />
      </View>
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingHorizontal: 20,
          height: Platform.OS === 'ios' ? 88 : 68,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarShowLabel: true,
      }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} icon={Home} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MisEntradas"
        component={MisEntradasScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} icon={Ticket} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} icon={User} color={color} />
          ),
        }}>
        {() => (
          <AuthRequired>
            <PerfilScreen />
          </AuthRequired>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
