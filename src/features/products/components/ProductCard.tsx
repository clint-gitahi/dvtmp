import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text, Badge } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import type { Product } from '@models/Product';
import {
  canAddToCart,
  describeCartIneligibility,
  getCartIneligibilityReason,
  isLowStock,
  isOutOfStock,
  isPremium,
} from '@features/products/businessRules';

type ProductCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
};

function ProductCardBase({ product, onPress, onAddToCart }: ProductCardProps) {
  const handlePress = useCallback(() => onPress?.(product), [onPress, product]);
  const handleAdd = useCallback(() => onAddToCart?.(product), [onAddToCart, product]);

  const finalPrice = product.price * (1 - product.discountPercentage / 100);
  const premium = isPremium(product);
  const lowStock = isLowStock(product);
  const outOfStock = isOutOfStock(product);
  const eligible = canAddToCart(product);
  const ineligibilityReason = eligible ? null : getCartIneligibilityReason(product);

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [
        styles.card, 
        premium && styles.cardPremium, 
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        <View style={styles.topLeftBadges}>
          {product.discountPercentage >= 1 ? (
            <Badge tone="danger" label={`-${Math.round(product.discountPercentage)}%`} />
          ) : null}
        </View>
        <View style={styles.topRightBadges}>
          {premium ? <Badge tone="premium" label="Premium Choice" /> : null}
        </View>
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

        <StockLine outOfStock={outOfStock} lowStock={lowStock} stock={product.stock} />

        <Button
          label={ineligibilityReason ? describeCartIneligibility(ineligibilityReason) : 'Add to cart'}
          size="sm"
          onPress={handleAdd}
          disabled={!eligible}
          fullWidth
          style={styles.cta}
        />
      </View>
    </Pressable>
  );
}


function StockLine({
  outOfStock,
  lowStock,
  stock,
}: {
  outOfStock: boolean;
  lowStock: boolean;
  stock: number;
}) {
  if (outOfStock) {
    return (
      <Text variant="micro" color="danger">
        Out of stock
      </Text>
    );
  }
  if (lowStock) {
    return (
      <Text variant="micro" color="warning">
        Almost sold out, {stock} left
      </Text>
    );
  }
  return (
    <Text variant="micro" color="success">
      {stock} in stock
    </Text>
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
  topLeftBadges: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  topRightBadges: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    alignItems: 'flex-end',
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
   prev.product.rating === next.product.rating &&
  prev.onPress === next.onPress &&
  prev.onAddToCart === next.onAddToCart,
);