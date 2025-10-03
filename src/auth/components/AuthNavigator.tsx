import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function AuthNavigator() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {isLogin ? <Login /> : <Register />}

      {/* Botón para cambiar entre Login y Register */}
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text
            style={{
              color: '#1D4ED8',
              fontSize: 16,
              fontWeight: '500',
            }}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
