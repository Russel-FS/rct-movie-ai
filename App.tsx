import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import './global.css';
import { Container } from '~/shared/components/Container';

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
        <Animated.View style={[{ padding: 20 }, animatedStyle]}>
          <View className="h-5 rounded-full bg-black p-5"></View>
          <Text className="rounded-full bg-blue-600 p-3 text-white" onPress={startAnimation}>
            ¡Toca este texto para ver la animación!
          </Text>
        </Animated.View>
      </Container>
      <StatusBar style="auto" />
    </>
  );
}
