import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import './global.css';
import { Container } from '~/shared/components/Container';
import Main from '~/home/components/Main';

export default function App() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startAnimation = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  };

  return (
    <>
      <Container>
        <Main></Main>
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
