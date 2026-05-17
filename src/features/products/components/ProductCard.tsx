import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import type { Product } from '@models/Product';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

function ProductCardBase({ product, onPress, onAddToCart }: ProductCardProps) {
  const handlePress = useCallback(() => onPress?.(product), [onPress, product]);
  const handleAdd = useCallback(() => onAddToCart?.(product), [onAddToCart, product]);

  const finalPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        {product.discountPercentage >= 1 ? (
          <View style={styles.discountBadge}>
            <Text variant="micro" color="white">
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text variant="micro" color="inkMuted" numberOfLines={1}>
          {(product.brand ?? product.category).toUpperCase()}
        </Text>
        <Text variant="bodyStrong" numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>

        <View style={styles.metaRow}>
          <Text variant="captionStrong" color="ink">
            ★ {product.rating.toFixed(1)}
          </Text>
          <View style={styles.dot} />
          <Text variant="caption" color="inkMuted" numberOfLines={1} style={styles.metaText}>
            {product.category}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text variant="bodyStrong" color="ink">
            ${finalPrice.toFixed(2)}
          </Text>
          {product.discountPercentage >= 1 ? (
            <Text variant="caption" color="inkMuted" style={styles.strike}>
              ${product.price.toFixed(2)}
            </Text>
          ) : null}
        </View>

        <Text variant="micro" color={product.stock > 0 ? 'success' : 'danger'}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </Text>

        <Button
          label="Add to cart"
          size="sm"
          onPress={handleAdd}
          disabled={product.stock === 0}
          fullWidth
          style={styles.cta}
        />
      </View>
    </Pressable>
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
  cardPressed: { 
    opacity: 0.92 
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: palette.surfaceMuted,
  },
  image: { 
    width: '100%', 
    height: '100%' 
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: palette.danger,
  },
  body: { 
    padding: spacing.md, 
    gap: spacing.xs 
  },
  title: { 
    marginTop: spacing.xxs, 
    minHeight: 42 
  },
  metaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.xs 
  },
  metaText: { 
    flexShrink: 1 
  },
  dot: { 
    width: 3, 
    height: 3, 
    borderRadius: 2, 
    backgroundColor: palette.inkMuted 
  },
  priceRow: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    gap: spacing.xs, 
    marginTop: spacing.xxs 
  },
  strike: { 
    textDecorationLine: 'line-through' 
  },
  cta: { 
    marginTop: spacing.sm 
  },
});

export const ProductCard = memo(ProductCardBase, (prev, next) =>
  prev.product.id === next.product.id &&
  prev.product.stock === next.product.stock &&
  prev.product.price === next.product.price &&
  prev.onPress === next.onPress &&
  prev.onAddToCart === next.onAddToCart,
);