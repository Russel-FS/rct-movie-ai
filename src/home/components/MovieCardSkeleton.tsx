import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function MovieCardSkeleton() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      className="overflow-hidden rounded-3xl border border-gray-800/20 bg-gray-900/30 backdrop-blur-2xl"
      style={{
        height: 340,
        marginBottom: 20,
      }}>
      <View className="relative" style={{ height: 220 }}>
        <Animated.View
          className="h-full w-full bg-gray-700/50"
          style={{ opacity: shimmerOpacity }}
        />

        <Animated.View
          className="absolute right-3 top-3 h-6 w-16 rounded-full bg-gray-600/50"
          style={{ opacity: shimmerOpacity }}
        />

        <Animated.View
          className="absolute bottom-3 left-3 h-6 w-12 rounded-xl bg-gray-600/50"
          style={{ opacity: shimmerOpacity }}
        />
      </View>

      <View className="flex-1 justify-between p-4" style={{ height: 120 }}>
        <View className="flex-1">
          <Animated.View
            className="mb-2 h-4 w-4/5 rounded bg-gray-700/50"
            style={{ opacity: shimmerOpacity }}
          />

          <Animated.View
            className="h-3 w-3/5 rounded bg-gray-700/30"
            style={{ opacity: shimmerOpacity }}
          />
        </View>

        <View className="mt-auto flex-row items-center justify-between">
          <Animated.View
            className="h-6 w-12 rounded-lg bg-gray-700/50"
            style={{ opacity: shimmerOpacity }}
          />

          <Animated.View
            className="h-4 w-16 rounded bg-gray-700/30"
            style={{ opacity: shimmerOpacity }}
          />
        </View>
      </View>
    </View>
  );
}
