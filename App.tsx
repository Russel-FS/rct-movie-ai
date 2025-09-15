import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import './global.css';
import { Container } from '~/shared/components/Container';
import Navigation from '~/shared/components/Navigation';
import Home from '~/home/page/Home';
import Cines from '~/home/page/Cines';
import Entradas from '~/home/page/Entradas';
import Perfil from '~/home/page/Perfil';
import Cartelera from '~/cartelera/pages/Cartelera';
import Auth from '~/auth/pages/Auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  const getActiveComponent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'cartelera':
        return <Cartelera />;
      case 'Cines':
        return <Cines />;
      case 'entries':
        return <Entradas />;
      case 'auth':
        return <Auth />;
      case 'profile':
        return <Perfil />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Container>
        {getActiveComponent()}
        <Navigation onTabChange={setActiveTab} initialTab={activeTab} />
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
