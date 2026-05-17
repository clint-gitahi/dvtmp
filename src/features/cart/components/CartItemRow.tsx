import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import { useAppDispatch } from '@shared/hooks/redux';
import { decreaseQuantity, increaseQuantity, removeItem, type CartItem } from '@features/cart/slice';
import { lineTotal } from '@features/cart/selectors';
import { maxQuantityInCart } from '@features/products/businessRules';

type CartItemRowProps = {
  item: CartItem;
};

function CartItemRowBase({ item }: CartItemRowProps) {
  const dispatch = useAppDispatch();
  const max = maxQuantityInCart(item.snapshot);
  const canIncrease = item.quantity < max;
  
  const handleIncrease = useCallback(
    () => dispatch(increaseQuantity(item.productId)),
    [dispatch, item.productId],
  );

  const handleDecrease = useCallback(
    () => dispatch(decreaseQuantity(item.productId)),
    [dispatch, item.productId],
  );

  const handleRemove = useCallback(
    () => dispatch(removeItem(item.productId)),
    [dispatch, item.productId],
  );

  const total = lineTotal(item);

  return (
    <View style={styles.row}>
      <Image 
        source={{ uri: item.snapshot.thumbnail }}
        style={styles.image} resizeMode="cover" 
      />
      <View style={styles.body}>
        <Text variant="micro" color="inkMuted" numberOfLines={1}>
          {(item.snapshot.brand ?? item.snapshot.category).toUpperCase()}
        </Text>
        <Text variant="bodyStrong" numberOfLines={2}>
          {item.snapshot.title}
        </Text>
        <Text variant="captionStrong" color="ink" style={styles.priceLine}>
          ${total.toFixed(2)}
        </Text>

        <View style={styles.controls}>
          <View style={styles.qtyGroup}>
            <QtyButton
              label="−"
              onPress={handleDecrease}
            />
            <Text variant="bodyStrong" style={styles.qty}>
              {item.quantity}
            </Text>
            <QtyButton 
              label="+"
              onPress={handleIncrease}
              disabled={!canIncrease}
            />
          </View>
          <Pressable onPress={handleRemove} hitSlop={6} style={styles.remove}>
            <Text variant="captionStrong" color="danger">
              Remove
            </Text>
          </Pressable>
        </View>

        {!canIncrease ? (
          <Text variant="micro" color="warning">
            Max quantity reached ({max} in stock)
          </Text>
        ) : null}
      </View>
    </View>
  );
}

type QtyButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

function QtyButton({ label, onPress, disabled }: QtyButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.qtyBtn,
        disabled && styles.qtyBtnDisabled,
        pressed && !disabled && styles.qtyBtnPressed,
      ]}
    >
      <Text variant="bodyStrong" color={disabled ? 'inkMuted' : 'ink'}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: radii.md,
    backgroundColor: palette.surfaceMuted,
  },
  body: { 
    flex: 1, 
    gap: spacing.xxs 
  },
  priceLine: { 
    marginTop: spacing.xxs 
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  qtyGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: { 
    backgroundColor: palette.surfaceMuted, 
    borderColor: palette.surfaceMuted 
  },
  qtyBtnPressed: { 
    opacity: 0.7 
  },
  qty: { 
    minWidth: 24, 
    textAlign: 'center' 
  },
  remove: { 
    paddingVertical: spacing.xs, 
    paddingHorizontal: spacing.xs 
  },
});

export const CartItemRow = memo(CartItemRowBase, (prev, next) =>
  prev.item.productId === next.item.productId &&
  prev.item.quantity === next.item.quantity &&
  prev.item.snapshot.price === next.item.snapshot.price &&
  prev.item.snapshot.discountPercentage === next.item.snapshot.discountPercentage &&
  prev.item.snapshot.stock === next.item.snapshot.stock,
);