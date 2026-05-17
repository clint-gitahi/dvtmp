import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetProductFeedQuery } from '@features/products/api/productsApi';
import type { FeedScope } from '@types/Product';

const DEFAULT_PAGE_SIZE = 20;

type UseProductFeedOptions = {
  scope: FeedScope;
  pageSize?: number;
};

export function useProductFeed({ scope, pageSize = DEFAULT_PAGE_SIZE }: UseProductFeedOptions) {
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
  } = useGetProductFeedQuery({ scope, page, pageSize });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const hasMore = products.length < total;

  const inFlightPageRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isFetching) inFlightPageRef.current = null;
  }, [isFetching]);

  const fetchNextPage = useCallback(() => {
    if (isFetching) return;
    if (!hasMore) return;
    const nextPage = page + 1;
    if (inFlightPageRef.current === nextPage) return;
    inFlightPageRef.current = nextPage;
    setPage(nextPage);
  }, [hasMore, isFetching, page]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = useCallback(async () => {
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
  }, [page, refetch]);

  const isInitialLoading = isLoading && products.length === 0;
  const isFetchingNextPage = isFetching && page > 0 && !isInitialLoading;

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