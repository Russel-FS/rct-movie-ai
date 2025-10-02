import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function HeroSkeleton() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };
    shimmer();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View className="relative mx-4 mb-10 h-96 w-auto overflow-hidden rounded-3xl">
      {/* Background skeleton */}
      <Animated.View className="flex-1 bg-gray-800/50" style={{ opacity: shimmerOpacity }} />

      {/* Content overlay */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pb-8">
        {/* Badge skeleton */}
        <Animated.View
          className="absolute -top-2 right-6 h-6 w-20 rounded-full bg-gray-600/60"
          style={{ opacity: shimmerOpacity }}
        />

        {/* Título skeleton */}
        <Animated.View
          className="mb-2 h-8 w-4/5 rounded bg-gray-600/60"
          style={{ opacity: shimmerOpacity }}
        />

        {/* Subtítulo skeleton */}
        <Animated.View
          className="mb-3 h-5 w-3/5 rounded bg-gray-600/40"
          style={{ opacity: shimmerOpacity }}
        />

        {/* Metadata skeleton */}
        <View className="mb-4 flex-row" style={{ gap: 16 }}>
          <Animated.View
            className="h-7 w-16 rounded-lg bg-gray-600/60"
            style={{ opacity: shimmerOpacity }}
          />
          <Animated.View
            className="h-7 w-20 rounded-lg bg-gray-600/60"
            style={{ opacity: shimmerOpacity }}
          />
          <Animated.View
            className="h-7 w-12 rounded-lg bg-gray-600/60"
            style={{ opacity: shimmerOpacity }}
          />
        </View>

        {/* Sinopsis skeleton */}
        <View className="mb-6">
          <Animated.View
            className="mb-1 h-3 w-full rounded bg-gray-600/40"
            style={{ opacity: shimmerOpacity }}
          />
          <Animated.View
            className="h-3 w-4/5 rounded bg-gray-600/40"
            style={{ opacity: shimmerOpacity }}
          />
        </View>

        {/* Botones skeleton */}
        <View className="flex-row" style={{ gap: 12 }}>
          <Animated.View
            className="h-12 flex-1 rounded-2xl bg-gray-600/60"
            style={{ opacity: shimmerOpacity }}
          />
          <Animated.View
            className="h-12 w-24 rounded-2xl bg-gray-600/40"
            style={{ opacity: shimmerOpacity }}
          />
        </View>
      </View>
    </View>
  );
}
