import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@shared/theme';
import { Text } from './Text';

type NetworkBannerProps = {
  visible: boolean;
};

export function NetworkBanner({ visible }: NetworkBannerProps) {
  if (!visible) return null;
  return (
    <View style={styles.root}>
      <View style={styles.dot} />
      <Text variant="captionStrong" color="white">
        You’re offline — showing cached content
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: palette.ink,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.warning,
  },
});