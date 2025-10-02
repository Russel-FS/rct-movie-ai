import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function StatsSkeleton() {
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

  const StatCardSkeleton = () => (
    <View className="mx-1 flex-1 rounded-2xl bg-gray-900/50 p-4 backdrop-blur-xl">
      <Animated.View
        className="mb-3 h-10 w-10 rounded-full bg-gray-700/50"
        style={{ opacity: shimmerOpacity }}
      />

      <Animated.View
        className="mb-1 h-6 w-8 rounded bg-gray-700/60"
        style={{ opacity: shimmerOpacity }}
      />

      <Animated.View
        className="h-3 w-16 rounded bg-gray-700/40"
        style={{ opacity: shimmerOpacity }}
      />
    </View>
  );

  return (
    <View className="mb-8 px-4">
      <Animated.View
        className="mb-4 h-6 w-32 rounded bg-gray-700/60"
        style={{ opacity: shimmerOpacity }}
      />

      <View className="flex-row">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
    </View>
  );
}
