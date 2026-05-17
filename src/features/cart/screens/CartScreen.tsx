import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { EmptyState, Screen, Text } from '@shared/components';
import { palette, spacing } from '@shared/theme';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { CartItemRow } from '@features/cart/components/CartItemRow';
import { CartTotals } from '@features/cart/components/CartTotals';
import { clearCart, type CartItem } from '@features/cart/slice';
import {
  selectCartCount,
  selectCartItems,
  selectCartTotals,
} from '@features/cart/selectors';
import type { AppTabsParamList } from '@app/navigation/types';

export function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const totals = useAppSelector(selectCartTotals);
  const navigation = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();

  const renderItem = useCallback<ListRenderItem<CartItem>>(
    ({ item }) => <CartItemRow item={item} />,
    [],
  );
  const keyExtractor = useCallback((item: CartItem) => String(item.productId), []);

  if (items.length === 0) {
    return (
      <Screen padded>
        <EmptyState
          title="Your dvt cart is empty"
          description="Browse the marketplace and add a few things you like."
          actionLabel="Start shopping"
          onAction={() => navigation.navigate('Home')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <View style={styles.headerRow}>
        <Text variant="title">Cart</Text>
        <Text variant="caption" color="inkMuted">
          {count} {count === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <CartTotals {...totals} />
            <Text
              variant="captionStrong"
              color="danger"
              align="center"
              style={styles.clear}
              onPress={() => dispatch(clearCart())}
            >
              Clear cart
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: palette.surfaceAlt,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  separator: { 
    height: spacing.md 
  },
  footer: { 
    gap: spacing.lg, 
    marginTop: spacing.xl 
  },
  clear: { 
    paddingVertical: spacing.md 
  },
});