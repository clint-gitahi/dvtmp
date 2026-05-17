import React, { useCallback, useMemo, useState  } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, Text } from '@shared/components';
import { spacing } from '@shared/theme';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { ProductFeed } from '@features/products/components/ProductFeed';
import { useProductFeed } from '@features/products/hooks/useProductFeed';
import { CategoryChips } from '@features/products/components/CategoryChips';
import { FilterButton } from '@features/products/components/FilterButton';
import { SortSheet } from '@features/products/components/SortSheet';
import { setCategory, setSort } from '@features/products/filtersSlice';
import { useAddToCart } from '@features/cart/hooks/useAddToCart';
import type { FeedScope, Product } from '@models/Product';
import type { RootStackParamList } from '@app/navigation/types';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const category = useAppSelector(s => s.filters.category);
  const sort = useAppSelector(s => s.filters.sort);
  const [sortOpen, setSortOpen] = useState(false);

  const scope: FeedScope = useMemo(() => 
    category ? 
      { type: 'category', category, sort: sort ?? undefined } : 
      {type: 'all', sort: sort ?? undefined }, 
    [category, sort])

  const feed = useProductFeed({ scope });
  const addToCart = useAddToCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSelectCategory = useCallback(
    (slug: string | null) => dispatch(setCategory(slug)),
    [dispatch],
  );

  const handleProductPress = useCallback((product: Product) => 
    navigation.navigate('ProductDetails', { productId: product.id }),
    [navigation],
  )

   const header = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text variant="title">Hi, {user?.name ?? 'Shopper'}</Text>
          </View>
          <FilterButton active={sort !== null} onPress={() => setSortOpen(true)} />
        </View>
        <CategoryChips selected={category} onSelect={handleSelectCategory} />
      </View>
    ),
    [user?.name, sort, category, handleSelectCategory],
  );

  return (
    <Screen edges={['top']}>
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
        ListHeaderComponent={header}
      />
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
  headerWrap: { 
    gap: spacing.sm, 
    paddingBottom: spacing.sm 
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  greetingText: { 
    flex: 1, 
    gap: spacing.xxs 
  },
});