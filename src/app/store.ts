import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { authReducer } from '@features/auth/slice';
import { filtersReducer } from '@features/products/filtersSlice';
import { cartReducer } from '@features/cart/slice'
import { reduxPersistMmkv } from '@shared/storage/mmkv';
import { productsApi } from '@features/products/api/productsApi';

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage: reduxPersistMmkv,
      whitelist: ['user', 'token'],
    },
    authReducer,
  ),
  [productsApi.reducerPath]: productsApi.reducer,
  filters: persistReducer(
    {
      key: 'filters',
      storage: reduxPersistMmkv,
      whitelist: ['category', 'sort'],
    },
    filtersReducer,
  ),
  cart: persistReducer(
    {
      key: 'cart',
      storage: reduxPersistMmkv,
      whitelist: ['items']
    },
    cartReducer,
  )
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(productsApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;