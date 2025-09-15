import { StatusBar } from 'expo-status-bar';

import './global.css';
import { Container } from '~/shared/components/Container';
import Home from '~/home/page/Home';
import Navigation from '~/shared/components/Navigation';

export default function App() {
  return (
    <>
      <Container>
        <Home />
        <Navigation />
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
