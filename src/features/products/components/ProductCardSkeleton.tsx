import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette, radii, shadows, spacing } from '@shared/theme';

function ProductCardSkeletonBase() {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.body}>
        <Animated.View style={[styles.bar, styles.barShort, { opacity }]} />
        <Animated.View style={[styles.bar, styles.barLong, { opacity }]} />
        <Animated.View style={[styles.bar, styles.barMedium, { opacity }]} />
        <Animated.View style={[styles.bar, styles.barCta, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: {
    aspectRatio: 1,
    backgroundColor: palette.surfaceMuted,
  },
  body: { 
    padding: spacing.md, 
    gap: spacing.sm 
  },
  bar: {
    height: 10,
    borderRadius: radii.sm,
    backgroundColor: palette.surfaceMuted,
  },
  barShort: { 
    width: '40%' 
  },
  barMedium: { 
    width: '70%' 
  },
  barLong: { 
    width: '95%' 
  },
  barCta: { 
    height: 32, 
    marginTop: spacing.xs 
  },
});

export const ProductCardSkeleton = memo(ProductCardSkeletonBase);