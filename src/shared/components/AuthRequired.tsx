import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from '~/auth/components/AuthNavigator';

interface AuthRequiredProps {
  children: React.ReactNode;
}

export default function AuthRequired({ children }: AuthRequiredProps) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
        }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!usuario) {
    return <AuthNavigator />;
  }

  return <>{children}</>;
}
