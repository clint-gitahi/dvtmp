import { combineReducers, configureStore } from '@reduxjs/toolkit';
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
import { reduxPersistMmkv } from '@shared/storage/mmkv';

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage: reduxPersistMmkv,
      whitelist: ['user', 'token'],
    },
    authReducer,
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefault =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;