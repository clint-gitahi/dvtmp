import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/shared/api/baseQuery";
import type {
  FeedPageArg,
  FeedScope,
  Product,
  ProductCategory,
  ProductsPage,
  SortKey,
} from '@types/Product'

const SORT_PARAMS: Record<SortKey, { sortBy: string; order: 'asc' | 'desc' }> = {
  priceAsc: { sortBy: 'price', order: 'asc' },
  priceDesc: { sortBy: 'price', order: 'desc' },
  ratingDesc: { sortBy: 'rating', order: 'desc' },
};

function scopeKey(scope: FeedScope): string {
  const sort = scope.sort ?? 'default';
  switch (scope.type) {
    case 'all':
      return `all|${sort}`;
    case 'category':
      return `category:${scope.category}|${sort}`;
    case 'search':
      return `search:${scope.query.toLowerCase().trim()}|${sort}`;
  }
}

function buildFeedUrl({ scope, page, pageSize }: FeedPageArg): {
  url: string;
  params: Record<string, string | number>;
} {
  const skip = page * pageSize;
  const params: Record<string, string | number> = { limit: pageSize, skip };
  if (scope.sort) {
    const { sortBy, order } = SORT_PARAMS[scope.sort];
    params.sortBy = sortBy;
    params.order = order;
  }
  switch (scope.type) {
    case 'all':
      return { url: '/products', params };
    case 'category':
      return { url: `/products/category/${encodeURIComponent(scope.category)}`, params };
    case 'search':
      return { url: '/products/search', params: { ...params, q: scope.query } };
  }
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Product', 'Feed', 'Category'],
  endpoints: build => ({
    getProductFeed: build.query<ProductsPage, FeedPageArg>({
      query: arg => {
        const { url, params } = buildFeedUrl(arg);
        return { url, params };
      },
      serializeQueryArgs: ({ queryArgs }) => scopeKey(queryArgs.scope),
      merge: (currentCache, incoming) => {
        if (incoming.skip === 0) {
          currentCache.products = incoming.products;
        } else {
          const seen = new Set(currentCache.products.map(p => p.id));
          for (const product of incoming.products) {
            if (!seen.has(product.id)) {
              currentCache.products.push(product);
            }
          }
        }
        currentCache.total = incoming.total;
        currentCache.skip = incoming.skip;
        currentCache.limit = incoming.limit;
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page ||
        scopeKey(currentArg!.scope) !== scopeKey(previousArg?.scope ?? currentArg!.scope),
      providesTags: (_result, _err, arg) => [{ type: 'Feed', id: scopeKey(arg.scope) }],
    }),
  }),
});

export const {
  useGetProductFeedQuery,
} = productsApi;