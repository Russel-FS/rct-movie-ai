import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { RootStackParamList } from '~/shared/types/navigation';

// Navegadores
import MainTabNavigator from '~/shared/components/Navigation';

import GenreMovies from '~/home/page/GenreMovies';
import SeleccionLugar from '~/cartelera/pages/SeleccionLugar';
import SeleccionHorario from '~/cartelera/pages/SeleccionHorario';
import SeleccionButacas from '~/cartelera/pages/SeleccionButacas';
import SeleccionComidas from '~/cartelera/pages/SeleccionComidas';
import MetodoPago from '~/cartelera/pages/MetodoPago';
import ResumenPago from '~/cartelera/pages/ResumenPago';
import AdminDashboard from '~/admin/pages/AdminDashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}>
        {/* Navegador principal con tabs */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Pantalla de género específico */}
        <Stack.Screen
          name="GenreMovies"
          component={GenreMovies}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Panel de Administración */}
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            animation: 'slide_from_right',
          }}
        />

        {/* Flujo de compra de entradas */}
        <Stack.Screen
          name="SeleccionLugar"
          component={SeleccionLugar}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="SeleccionHorario"
          component={SeleccionHorario}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="SeleccionButacas"
          component={SeleccionButacas}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="SeleccionComidas"
          component={SeleccionComidas}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="MetodoPago"
          component={MetodoPago}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="ResumenPago"
          component={ResumenPago}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>

      <StatusBar style="light" backgroundColor="#000000" />
    </NavigationContainer>
  );
}
