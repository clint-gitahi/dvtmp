import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { EmptyState, ErrorState, Text, Button } from '@shared/components';
import { palette, spacing } from '@shared/theme';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product } from '@models/Product';

type ProductFeedProps = {
  products: Product[];
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  error?: unknown;
  onEndReached: () => void;
  onRefresh: () => void;
  onProductPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  ListHeaderComponent?: React.ReactElement;
  emptyTitle?: string;
  emptyDescription?: string;
  hasFirstPageError?: boolean;
  isPaginationError?: boolean;
  onRetryNextPage?: () => void;
};

const GAP = spacing.md;
const SKELETON_COUNT = 6;

export function ProductFeed({
  products,
  isInitialLoading,
  isFetchingNextPage,
  isRefreshing,
  hasMore,
  error,
  onEndReached,
  onRefresh,
  onProductPress,
  onAddToCart,
  ListHeaderComponent,
  emptyTitle = 'No products',
  emptyDescription = 'Try again',
  hasFirstPageError,
  isPaginationError,
  onRetryNextPage,
}: ProductFeedProps) {
  const COLUMNS = 2;
  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
      <View style={styles.cell}>
        <ProductCard product={item} onPress={onProductPress} onAddToCart={onAddToCart} />
      </View>
    ),
    [onProductPress, onAddToCart],
  );

  const keyExtractor = useCallback((item: Product) => String(item.id), []);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        tintColor={palette.primary}
        colors={[palette.primary]}
      />
    ),
    [isRefreshing, onRefresh],
  );

  if (isInitialLoading) {
    return (
      <SkeletonGrid header={ListHeaderComponent} />
    );
  }

  if (hasFirstPageError) {
    return (
      <ErrorState
        title="Error Loading Products"
        description="Please check your connection and try again."
        onRetry={onRefresh}
      />
    );
  }

  return (
    <FlashList
      data={products}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={COLUMNS}
      contentContainerStyle={styles.content}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <EmptyState title={emptyTitle} description={emptyDescription} />
      }
      ListFooterComponent={
        <ListFooter
          isFetchingNextPage={isFetchingNextPage}
          isPaginationError={!!isPaginationError}
          hasMore={hasMore}
          hasItems={products.length > 0}
          onRetry={onRetryNextPage}
        />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      refreshControl={refreshControl}
      removeClippedSubviews
    />
  );
}

function SkeletonGrid({ header }: { header?: React.ReactElement }) {
  return (
    <View style={styles.content}>
      {header}
      <View style={styles.skeletonGrid}>
        {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
          <View key={idx} style={styles.skeletonCell}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    </View>
  );
}

type ListFooterProps = {
  isFetchingNextPage: boolean;
  isPaginationError: boolean;
  hasMore: boolean;
  hasItems: boolean;
  onRetry?: () => void;
};

function ListFooter({
  isFetchingNextPage,
  hasMore,
  hasItems,
  isPaginationError,
  onRetry
}: ListFooterProps) {
  if (isFetchingNextPage) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if(isPaginationError) {
    return (
      <View style={styles.errorFooter}>
        <Text variant="caption" color="inkMuted" align="center">
          Could not load any more items.
        </Text>
        {onRetry ? (
          <Button label="Try again" variant="secondary" size="sm" onPress={onRetry} />
        ) : null}
      </View>
    )
  }

  if (!hasMore && hasItems) {
    return (
      <View style={styles.footer}>
        <Text variant="caption" color="inkMuted">
          You’ve reached the end
        </Text>
      </View>
    );
  }
  return <View style={styles.footerSpacer} />;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: GAP / 2,
    paddingTop: GAP,
    paddingBottom: spacing.xxl,
  },
  skeletonGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  skeletonCell: {
    width: '50%',
    paddingHorizontal: GAP / 2,
    paddingBottom: GAP,
  },
  cell: {
    flex: 1,
    paddingHorizontal: GAP / 2,
    paddingBottom: GAP,
  },
  footer: { 
    paddingVertical: spacing.lg, 
    alignItems: 'center' 
  },
  footerSpacer: { 
    height: spacing.lg 
  },
  errorFooter: { 
    paddingVertical: spacing.lg, 
    alignItems: 'center', 
    gap: spacing.sm 
  },
});