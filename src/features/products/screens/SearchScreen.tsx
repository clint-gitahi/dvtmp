import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, SearchBar, EmptyState } from '@shared/components';
import { spacing } from '@shared/theme';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { useDebouncedValue } from '@shared/hooks/useDebouncedValue';
import { ProductFeed } from '@features/products/components/ProductFeed';
import { FilterButton } from '@features/products/components/FilterButton';
import { SortSheet } from '@features/products/components/SortSheet';
import { useProductFeed } from '@features/products/hooks/useProductFeed';
import { setSort } from '@features/products/filtersSlice';
import { useAddToCart } from '@features/cart/hooks/useAddToCart';
import type { FeedScope, Product } from '@models/Product';
import type { RootStackParamList } from '@app/navigation/types';

const MIN_QUERY_LENGTH = 2;

export function SearchScreen() {
  const dispatch = useAppDispatch();
  const sort = useAppSelector(s => s.filters.sort);
  const [query, setQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length >= MIN_QUERY_LENGTH;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const scope: FeedScope = useMemo(
    () => ({ type: 'search', query: debouncedQuery, sort: sort ?? undefined }),
    [debouncedQuery, sort],
  );

  const feed = useProductFeed({ scope, enabled: hasQuery });
  const addToCart = useAddToCart();

  const handleProductPress = useCallback(
    (product: Product) => navigation.navigate('ProductDetails', { productId: product.id }),
    [navigation],
  );

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
              placeholder="Search products"
            />
          </View>
          <FilterButton active={sort !== null} onPress={() => setSortOpen(true)} />
        </View>
      </View>

      {hasQuery ? (
        <ProductFeed
          products={feed.products}
          isInitialLoading={feed.isInitialLoading}
          isFetchingNextPage={feed.isFetchingNextPage}
          isRefreshing={feed.isRefreshing}
          hasMore={feed.hasMore}
          error={feed.error}
          onEndReached={feed.fetchNextPage}
          onRefresh={feed.refresh}
          onAddToCart={addToCart}
          onProductPress={handleProductPress}
          emptyTitle="No matches"
          emptyDescription={`We couldn’t find anything for "${debouncedQuery}".`}
        />
      ) : (
        <EmptyState
          title="Search the marketplace"
          description="Type at least 2 characters to see results."
        />
      )}

      <SortSheet
        visible={sortOpen}
        selected={sort}
        onSelect={value => dispatch(setSort(value))}
        onClose={() => setSortOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInputWrap: { flex: 1 },
});