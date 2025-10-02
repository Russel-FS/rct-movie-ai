import { View, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import HeroSkeleton from './HeroSkeleton';
import StatsSkeleton from './StatsSkeleton';
import GenreSectionSkeleton from './GenreSectionSkeleton';

export default function HomeSkeleton() {
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
    <View className="flex-1 bg-black">
      <View className="px-4 pb-6 pt-14">
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            {/* Saludo skeleton */}
            <Animated.View
              className="mb-1 h-4 w-20 rounded bg-gray-700/50"
              style={{ opacity: shimmerOpacity }}
            />
            {/* Título skeleton */}
            <Animated.View
              className="h-6 w-48 rounded bg-gray-700/60"
              style={{ opacity: shimmerOpacity }}
            />
          </View>

          {/* Botones skeleton */}
          <View className="flex-row space-x-3">
            <Animated.View
              className="h-10 w-10 rounded-full bg-gray-700/50"
              style={{ opacity: shimmerOpacity }}
            />
            <Animated.View
              className="h-10 w-10 rounded-full bg-gray-700/50"
              style={{ opacity: shimmerOpacity }}
            />
          </View>
        </View>

        <Animated.View
          className="h-12 w-full rounded-2xl border border-gray-700/50 bg-gray-800/50"
          style={{ opacity: shimmerOpacity }}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <HeroSkeleton />
        <StatsSkeleton />
        <GenreSectionSkeleton />
        <GenreSectionSkeleton />
        <GenreSectionSkeleton />

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
