import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import './global.css';

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
      <ScreenContent title="Home" path="App.tsx">
        <Animated.View style={[{ padding: 20 }, animatedStyle]}>
          <Text onPress={startAnimation}>¡Toca este texto para ver la animación!</Text>
        </Animated.View>
      </ScreenContent>
      <StatusBar style="auto" />
    </>
  );
}
