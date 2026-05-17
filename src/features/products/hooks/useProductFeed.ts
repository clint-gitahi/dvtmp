import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetProductFeedQuery } from '@features/products/api/productsApi';
import type { FeedScope } from '@models/Product';

const DEFAULT_PAGE_SIZE = 20;

type UseProductFeedOptions = {
  scope: FeedScope;
  pageSize?: number;
  enabled?: boolean;
};

export function useProductFeed({ scope, pageSize = DEFAULT_PAGE_SIZE, enabled = true }: UseProductFeedOptions) {
  const [page, setPage] = useState(0);

  const scopeKey = useScopeKey(scope);
  useEffect(() => {
    setPage(0);
  }, [scopeKey]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductFeedQuery({ scope, page, pageSize }, { skip: !enabled });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const hasMore = products.length < total;

  const inFlightPageRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isFetching) inFlightPageRef.current = null;
  }, [isFetching]);

  const fetchNextPage = useCallback(() => {
    if (!enabled || isFetching || !hasMore) return;
    const nextPage = page + 1;
    if (inFlightPageRef.current === nextPage) return;
    inFlightPageRef.current = nextPage;
    setPage(nextPage);
  }, [hasMore, isFetching, page, enabled]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    if (!enabled) return;
    setIsRefreshing(true);
    try {
      if (page !== 0) {
        setPage(0);
      } else {
        await refetch();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [page, refetch, enabled]);

  const retryNextPage = useCallback(() => {
    inFlightPageRef.current = null;
    refetch();
  }, [refetch]);

  const isInitialLoading = enabled && isLoading && products.length === 0;
  const isFetchingNextPage = enabled && isFetching && page > 0 && !isInitialLoading;
  const hasFirstPageError = Boolean(error) && products.length === 0;
  const isPaginationError = Boolean(error) && products.length > 0 && !isFetching;

  return {
    products,
    total,
    hasMore,
    error,
    isInitialLoading,
    isFetchingNextPage,
    isRefreshing,
    fetchNextPage,
    refresh,
    hasFirstPageError,
    isPaginationError,
    retryNextPage,
  };
}

function useScopeKey(scope: FeedScope): string {
  switch (scope.type) {
    case 'all':
      return `all|${scope.sort ?? ''}`;
    case 'category':
      return `category:${scope.category}|${scope.sort ?? ''}`;
    case 'search':
      return `search:${scope.query.toLowerCase().trim()}|${scope.sort ?? ''}`;
  }
}