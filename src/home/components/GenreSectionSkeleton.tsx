import { View, ScrollView } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import MovieCardSkeleton from './MovieCardSkeleton';

export default function GenreSectionSkeleton() {
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
    <View className="mb-8">
      {/* Header skeleton */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View>
          {/* Título skeleton */}
          <Animated.View
            className="mb-2 h-6 w-24 rounded bg-gray-700/60"
            style={{ opacity: shimmerAnimation }}
          />
          {/* Descripción skeleton */}
          <Animated.View
            className="h-3 w-32 rounded bg-gray-700/40"
            style={{ opacity: shimmerAnimation }}
          />
        </View>

        {/* Botón "Ver Todo" skeleton */}
        <Animated.View
          className="h-8 w-20 rounded-full bg-gray-700/50"
          style={{ opacity: shimmerAnimation }}
        />
      </View>

      {/* Scroll horizontal skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, gap: 16 }}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={{ width: 180 }}>
            <MovieCardSkeleton />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
