import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { palette, spacing } from '@shared/theme';
import { Text } from '@shared/components';

export function SplashScreen() {
  return (
    <View style={styles.root}>
      <Text variant="display" color="white">
        Marketplace
      </Text>
      <ActivityIndicator color={palette.white} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: { marginTop: spacing.lg },
});