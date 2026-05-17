import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { palette, spacing } from '@shared/theme';

const { width: SCREEN_W } = Dimensions.get('window');

type ImageGalleryProps = {
  images: string[];
  height?: number;
};

export function ImageGallery({ images, height = SCREEN_W }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setActiveIndex(index);
  }, []);

  if (images.length === 0) {
    return <View style={[styles.placeholder, { width: SCREEN_W, height }]} />;
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        bounces={false}
      >
        {images.map((uri, idx) => (
          <Image
            key={`${uri}-${idx}`}
            source={{ uri }}
            style={{ width: SCREEN_W, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { 
    backgroundColor: palette.surfaceMuted 
  },
  dots: {
    position: 'absolute',
    bottom: spacing.lg,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: palette.white,
  },
});