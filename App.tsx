import { StatusBar } from 'expo-status-bar';

import './global.css';
import { Container } from '~/shared/components/Container';
import Main from '~/home/components/Main';

export default function App() {
  return (
    <>
      <Container>
        <Main></Main>
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
