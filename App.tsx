import { StatusBar } from 'expo-status-bar';

import './global.css';
import { Container } from '~/shared/components/Container';
import Home from '~/home/page/Home';

export default function App() {
  return (
    <>
      <Container>
        <Home />
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
