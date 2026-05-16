import { createMMKV } from 'react-native-mmkv';
import type { Storage } from 'redux-persist';

export const storage = createMMKV({ id: 'marketplace.app' });

export const reduxPersistMmkv: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: key => {
    storage.remove(key);
    return Promise.resolve();
  },
};