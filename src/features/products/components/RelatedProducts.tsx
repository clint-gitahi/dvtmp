import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Text } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import { useGetProductFeedQuery } from '@features/products/api/productsApi';
import type { Product } from '@models/Product';

type RelatedProductsProps = {
  category: string;
  excludeId: number;
  onPress: (product: Product) => void;
};

export function RelatedProducts({ category, excludeId, onPress }: RelatedProductsProps) {
  const { data, isLoading } = useGetProductFeedQuery({
    scope: { type: 'category', category },
    page: 0,
    pageSize: 20,
  });

  const related = useMemo(
    () => (data?.products ?? []).filter(p => p.id !== excludeId).slice(0, 10),
    [data?.products, excludeId],
  );

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => <RelatedCard product={item} onPress={onPress} />,
    [onPress],
  );

  if (isLoading) {
    return (
      <View style={styles.skeletonRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.skeletonCard} />
        ))}
      </View>
    );
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <View style={styles.listWrap}>
      <FlashList
        data={related}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function RelatedCard({ product, onPress }: { product: Product; onPress: (p: Product) => void }) {
  const handle = useCallback(() => onPress(product), [onPress, product]);
  const finalPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Pressable 
      onPress={handle} 
      style={({ pressed }) => [
        styles.card, 
        pressed && styles.cardPressed
      ]}
    >
      <Image 
        source={{ uri: product.thumbnail }} 
        style={styles.image}
        resizeMode="cover" 
      />
      <View style={styles.body}>
        <Text variant="captionStrong" numberOfLines={2}>
          {product.title}
        </Text>
        <Text variant="bodyStrong" color="ink">
          ${finalPrice.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listWrap: { 
    height: 220 
  },
  list: { 
    paddingHorizontal: spacing.lg, 
    gap: spacing.md 
  },
  card: {
    width: 140,
    marginRight: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardPressed: { 
    opacity: 0.9 
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: palette.surfaceMuted,
  },
  body: { 
    padding: spacing.sm, 
    gap: spacing.xxs 
  },
  skeletonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  skeletonCard: {
    width: 140,
    height: 200,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceMuted,
  },
});