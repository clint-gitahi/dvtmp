import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen, Text } from '@shared/components';
import { spacing } from '@shared/theme';
import { useAppSelector } from '@shared/hooks/redux';
import { ProductFeed } from '@features/products/components/ProductFeed';
import { useProductFeed } from '@features/products/hooks/useProductFeed';

export function HomeScreen() {
  const user = useAppSelector(s => s.auth.user);

  const {
    products,
    hasMore,
    error,
    isInitialLoading,
    isFetchingNextPage,
    isRefreshing,
    fetchNextPage,
    refresh,
  } = useProductFeed({ scope: { type: 'all' } });

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Text variant="title">Hi {user?.name ?? 'Shopper'}</Text>
      </View>
    ),
    [user?.name],
  );

  return (
    <Screen edges={['top']}>
      <ProductFeed
        products={products}
        isInitialLoading={isInitialLoading}
        isFetchingNextPage={isFetchingNextPage}
        isRefreshing={isRefreshing}
        hasMore={hasMore}
        error={error}
        onEndReached={fetchNextPage}
        onRefresh={refresh}
        ListHeaderComponent={header}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.xxs,
  },
});