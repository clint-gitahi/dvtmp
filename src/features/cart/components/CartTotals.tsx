import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@shared/components';
import { palette, radii, shadows, spacing } from '@shared/theme';
import { BULK_DISCOUNT_RATE, BULK_DISCOUNT_THRESHOLD } from '@features/cart/selectors';

type CartTotalsProps = {
  subtotal: number;
  discount: number;
  total: number;
  eligible: boolean;
};

export function CartTotals({ subtotal, discount, total, eligible }: CartTotalsProps) {
  const remaining = Math.max(0, BULK_DISCOUNT_THRESHOLD - subtotal);

  return (
    <View style={styles.card}>
      <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
      {eligible ? (
        <>
          <View style={styles.discountBanner}>
            <Text variant="captionStrong" color="success">
              Bulk discount applied ({(BULK_DISCOUNT_RATE * 100).toFixed(0)}% off)
            </Text>
          </View>
          <Row
            label="Discount"
            value={`−$${discount.toFixed(2)}`}
            valueColor="success"
          />
        </>
      ) : remaining > 0 ? (
        <Text variant="caption" color="inkMuted" style={styles.hint}>
          Add ${remaining.toFixed(2)} more to unlock {(BULK_DISCOUNT_RATE * 100).toFixed(0)}% bulk discount.
        </Text>
      ) : null}
      <View style={styles.divider} />
      <Row
        label="Total"
        value={`$${total.toFixed(2)}`}
        labelVariant="bodyStrong"
        valueVariant="title"
      />
    </View>
  );
}

type RowProps = {
  label: string;
  value: string;
  labelVariant?: 'body' | 'bodyStrong';
  valueVariant?: 'body' | 'bodyStrong' | 'title';
  valueColor?: 'ink' | 'success';
};

function Row({
  label,
  value,
  labelVariant = 'body',
  valueVariant = 'bodyStrong',
  valueColor = 'ink',
}: RowProps) {
  return (
    <View style={styles.row}>
      <Text variant={labelVariant} color="inkSoft">
        {label}
      </Text>
      <Text variant={valueVariant} color={valueColor}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline' 
  },
  discountBanner: {
    backgroundColor: '#E8F6EE',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  hint: {},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.border,
    marginVertical: spacing.xs,
  },
});