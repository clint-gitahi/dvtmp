# Marketplace Explorer

A production-style React Native catalog app built against [dummyjson.com/products](https://dummyjson.com/docs/products). Browse a large product catalog with category filters, debounced search, sort, persistent cart, business-rule-aware UI, and offline-friendly caching.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Language | TypeScript (strict) | Required by spec; carries the rules from `businessRules.ts` into every consumer |
| State | **Redux Toolkit + RTK Query** | RTK Query gives pagination cache, request dedup, retry, and offline-friendly cache for free — directly hits the "prevent duplicate fetches" and "pagination caching" criteria |
| Persistence | **MMKV** + redux-persist (custom storage adapter) | Sync, JSI-backed, fast. Auth / cart / filters slices persisted; product cache stays in RTK Query memory |
| List | [`@shopify/flash-list`](https://github.com/Shopify/flash-list) v2 | Real virtualization for the "very important" large-list requirement |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) | Native push perf; auth gate at the root |
| Network | `fetchBaseQuery` (built into RTK Query) + NetInfo | One less library; NetInfo bridges into RTK Query's `setOnline` / `setOffline` |
| Forms | `react-hook-form` + `zod` | Clean schema-validated login form |


This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Prerequisites

- **Node** ≥ 22.13 (RN 0.85 prefers this; 22.8 works with an engine warning)
- **Ruby** with Bundler (for CocoaPods)
- **Xcode** 16+ for iOS
- **Android Studio** + JDK 17 for Android
- See [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) if any of these are missing.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of this project:

```sh
# Using npm
npm start

# OR 
npx react-native start --reset-cache
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of this project, and use one of the following commands to build and run the app on Android or iOS:

### Android

```sh
# Using npm
npm run android

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

then

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

The mock login accepts any email and 6+ char password. Pass `fail` as the password to exercise the error path.

### Test

```sh
npm test
```

If everything is set up correctly, you should see the app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Project structure

```
src/
├── app/
│   ├── store.ts                 # configureStore + persist + RTK Query middleware + NetInfo bridge
│   ├── navigation/              # RootNavigator (auth gate) + AuthStack + AppTabs
│   └── providers/               # AppProviders chain + OnlineGate (offline banner + safe-area override)
├── features/
│   ├── auth/                    # mockAuth API, zod schema, useLogin hook, Splash + Login screens
│   ├── products/
│   │   ├── api/productsApi.ts   # RTK Query: getProductFeed (paginated), getProductById, getCategories
│   │   ├── businessRules.ts     # PURE FUNCTIONS — isPremium / isLowStock / canAddToCart / …
│   │   ├── filtersSlice.ts      # persisted: category + sort
│   │   ├── hooks/useProductFeed.ts   # paginate, dedup-safe, retry, scope-aware
│   │   ├── components/          # ProductCard, ProductCardSkeleton, ProductFeed (FlashList),
│   │   │                        # CategoryChips, SortSheet, FilterButton, ImageGallery, RelatedProducts
│   │   └── screens/             # HomeScreen, SearchScreen, ProductDetailsScreen
│   ├── cart/
│   │   ├── slice.ts             # items[{productId, quantity, snapshot}], stock-clamped, rules-aware
│   │   ├── selectors.ts         # subtotal, Rule D bulk discount, totals (createSelector-memoized)
│   │   ├── hooks/useAddToCart.ts
│   │   ├── components/          # CartItemRow, CartTotals
│   │   └── screens/CartScreen.tsx
│   └── profile/screens/ProfileScreen.tsx
├── models/Product.ts            # Domain types: Product, ProductsPage, FeedScope, SortKey, …
└── shared/
    ├── api/baseQuery.ts         # fetchBaseQuery (dummyjson, 15s timeout) wrapped with retry(2)
    ├── components/              # Button, Text, Input, SearchBar, Badge, Screen, EmptyState,
    │                            # ErrorState, NetworkBanner
    ├── hooks/                   # useAppDispatch/useAppSelector, useDebouncedValue, useIsOnline
    ├── storage/mmkv.ts          # MMKV instance + redux-persist Storage adapter
    └── theme/                   # palette, spacing, radii, typography, shadows
```

Path aliases (configured in `babel.config.js` + `tsconfig.json`): `@app/*`, `@features/*`, `@shared/*`, `@models/*`.

## Architecture

Four layers, kept apart deliberately. The spec's "anti-patterns" list explicitly names mixing business logic into UI — the structure below is the answer.

| Layer | Where it lives | Examples |
|---|---|---|
| **API** | `features/*/api/*` + `shared/api/baseQuery.ts` | `productsApi`, `mockAuth` |
| **State** | `features/*/slice.ts` + `features/cart/selectors.ts` | `cartSlice`, `filtersSlice`, `authSlice`, persisted via redux-persist |
| **Business logic** | `features/products/businessRules.ts` + `features/cart/selectors.ts` | `isPremium`, `canAddToCart`, `selectIsBulkEligible`, `selectDiscountAmount` — **all pure functions** |
| **UI** | `features/*/screens/*` + `features/*/components/*` + `shared/components/*` | Reads from state, calls business-logic functions for decisions, never inlines a rule |

A `ProductCard` never asks *"is this product premium?"* with inline conditions. It calls `isPremium(product)` and renders accordingly. That's the discipline the rest of the codebase follows.

## State management

**Why Redux Toolkit + RTK Query.** Three reasons, all tied to the evaluation criteria:

1. **Pagination caching is free.** `productsApi.getProductFeed` uses RTK Query's `serializeQueryArgs` + `merge` + `forceRefetch` triad to key the cache by `scopeKey` (e.g. `category:smartphones|priceAsc`). All pages for a given scope share one cache entry; switching back to a previously visited filter shows cached pages instantly.
2. **Dedup of duplicate fetches is free.** RTK Query won't fire two parallel requests with the same serialized args. The infinite-scroll hook adds a second guard (`inFlightPageRef`) so a rapid scroll-near-end doesn't enqueue duplicate page requests during a slow network.
3. **Offline cache is free.** `keepUnusedDataFor: 30 * 60` (30 minutes) on the products API keeps previously-loaded pages alive in memory, so flipping to airplane mode and reopening the app shows the last-seen feed.

**What lives where:**

| Slice | Persisted | Why |
|---|---|---|
| `auth` (user, token) | ✅ MMKV | Auto-login on app restart |
| `filters` (category, sort) | ✅ MMKV | Filters survive navigation and restart, per the spec |
| `cart` (items + snapshots) | ✅ MMKV | Cart must survive restart; each item carries a product snapshot so the cart is fully usable offline (no need to re-fetch products) |
| `productsApi` (RTK Query cache) | ❌ memory only | Cache is large and rebuilds on next launch in milliseconds; persisting it would be wasted I/O |

The search query is **not** in Redux — it's local component state inside `SearchScreen`, debounced via `useDebouncedValue`. Search is a transient per-session concern; putting it in Redux would create coupling without any consumer.

## Performance

The spec singles out the feed as "very important" — these are the levers that make it stay smooth at scale:

| Lever | Where |
|---|---|
| Virtualized rows via FlashList v2 | `ProductFeed.tsx` — 2-column grid, `removeClippedSubviews` |
| Skeleton grid during initial load (not a blank screen) | `ProductCardSkeleton.tsx` + `SkeletonGrid` inside `ProductFeed.tsx` |
| `ProductCard` memoization with shallow id/price/stock/rating compare | `ProductCard.tsx` `memo()` 2nd argument |
| Stable `keyExtractor` + `renderItem` via `useCallback` | `ProductFeed.tsx` |
| Pagination cache keyed by scope, merged with id-dedup | `productsApi.ts` `serializeQueryArgs` / `merge` |
| Onfly-page guard against duplicate fires of `onEndReached` | `useProductFeed.ts` `inFlightPageRef` |
| Debounced search (400ms) so typing doesn't spam the API | `useDebouncedValue` + `SearchScreen` |
| RTK Query keep-alive (30 min) so the feed stays warm offline | `productsApi.ts` `keepUnusedDataFor` |
| Selector memoization via `createSelector` (totals, count) | `cart/selectors.ts` |
| Image cache on Pinterest-style grid via stock `<Image uri={…}/>` | `ProductCard.tsx` — see "Tradeoffs" below for the upgrade path |

## Business rules

All four rules from the spec are implemented as pure functions / selectors, then consumed by the UI.

| Rule | Definition | Lives in | Surfaced in UI |
|---|---|---|---|
| A — Premium | `rating ≥ 4.5 AND price ≥ 1000` | `isPremium()` | Premium Choice badge + bordered card in `ProductCard`; badge in `ProductDetailsScreen` |
| B — Low stock | `0 < stock < 10` | `isLowStock()` | "Almost sold out — N left" warning label |
| C — Cart eligibility | `stock > 0 AND rating ≥ 3` | `canAddToCart()` + `getCartIneligibilityReason()` | Add-to-Cart button disabled with reason copy; `useAddToCart` hook also gates with an `Alert` as a belt-and-suspenders |
| D — Bulk discount | `subtotal > 5000` → 10% off | `selectIsBulkEligible`, `selectDiscountAmount`, `selectFinalTotal` | `CartTotals` shows subtotal / discount / final; below threshold shows "Add $X to unlock 10%" nudge |

## Offline & error handling

- **Connectivity** is observed by NetInfo. `useIsOnline` powers the `NetworkBanner`, and `setupListeners` in the store bridges NetInfo events into RTK Query's `onOnline` / `onOffline` so the cache layer knows about connectivity.
- **Offline banner** uses a `SafeAreaInsetsContext` override so screens don't double-pad below it.
- **Feed errors** are split into two states (in `useProductFeed`): `hasFirstPageError` (no products loaded at all → `ErrorState` with retry) vs `isPaginationError` (existing items stay visible, a retry footer appears at the end of the list).
- **Cart** is entirely offline-capable — Redux + MMKV with snapshots; no product re-fetch needed.
- **Product details** falls back to `ErrorState` with retry when the product hasn't been cached.

## Tradeoffs made

| Decision | Tradeoff |
|---|---|
| RTK Query over `react-query` + thunks | Tighter integration with the Redux store I already need for cart/auth/filters; one less library and one less mental model. Costs: slightly more verbose endpoint definitions than RQ's plain `useQuery`. |
| MMKV over AsyncStorage | Faster + sync access enables clean redux-persist storage adapter. Costs: extra native dependency, requires `react-native-nitro-modules` peer in v4. Worth it. |
| `fetchBaseQuery` over `axios` | RTK Query ships it; no extra dependency or interceptor layer needed. Costs: timeouts / retries are configured per-baseQuery rather than per-instance; fine for one API. |
| Snapshot-in-cart vs id-only-in-cart | Cart works fully offline and shows the price-at-add. Costs: stale data if the product changes server-side. Acceptable for an MVP cart; production would re-validate at checkout. |
| Stock `<Image />` over `react-native-fast-image` | Avoids another native module. Costs: no priority queue, no progressive image cache. Replacing it is a one-component change in `ProductCard` if perf becomes an issue. |
| Pure StyleSheet over NativeWind / Tamagui | Keeps the senior-engineer focus on architecture, perf, and state — not framework adoption. Theme tokens give consistency without a styling DSL. |
| Search + category don't combine | dummyjson.com's `/products/search` and `/products/category/...` are mutually exclusive on the server. Faking it client-side would require re-paging client-side too, which contradicts "pagination must work with filters." Honest tradeoff: Home tab = browse with category + sort, Search tab = query + sort. |
| Modal-based bottom sheet over `@gorhom/bottom-sheet` | The sort sheet is a simple list; a plain `Modal` with a transparent backdrop + slide animation is enough, and saves a native dep. |
| Plain `Animated` for the skeleton vs Reanimated | Skeleton pulse is one opacity loop; not worth pulling in Reanimated's compiler. |
