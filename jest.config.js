module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:jest-)?(?:react-native|@react-native|@react-navigation|@shopify/flash-list|@reduxjs/toolkit|react-redux|react-native-safe-area-context|react-native-gesture-handler|@react-native-community|immer|redux|reselect|redux-persist)/)',
  ],
};
