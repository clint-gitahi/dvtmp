import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: jest.fn(x => x),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 0, height: 0 };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaConsumer: ({ children }) => children(insets),
    SafeAreaView: View,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets, frame },
  };
});

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens');
  return { ...actual, enableScreens: jest.fn() };
});

jest.mock('react-native-mmkv', () => {
  const makeInstance = () => {
    const store = new Map();
    return {
      set: jest.fn((k, v) => store.set(k, v)),
      getString: jest.fn(k => (typeof store.get(k) === 'string' ? store.get(k) : undefined)),
      getNumber: jest.fn(k => (typeof store.get(k) === 'number' ? store.get(k) : undefined)),
      getBoolean: jest.fn(k => (typeof store.get(k) === 'boolean' ? store.get(k) : undefined)),
      contains: jest.fn(k => store.has(k)),
      remove: jest.fn(k => store.delete(k)),
      delete: jest.fn(k => store.delete(k)),
      getAllKeys: jest.fn(() => Array.from(store.keys())),
      clearAll: jest.fn(() => store.clear()),
      addOnValueChangedListener: jest.fn(() => ({ remove: jest.fn() })),
    };
  };
  return {
    createMMKV: jest.fn(() => makeInstance()),
    MMKV: jest.fn(() => makeInstance()),
  };
});
