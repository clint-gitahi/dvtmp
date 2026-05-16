import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, radii, spacing } from '@shared/theme';
import { Button } from './Button';
import { Text } from './Text';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this content. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <View style={styles.root}>
      <View style={styles.badge}>
        <Text variant="micro" color="danger">
          ERROR
        </Text>
      </View>
      <Text variant="title" align="center">
        {title}
      </Text>
      <Text variant="body" color="inkMuted" align="center" style={styles.description}>
        {description}
      </Text>
      {onRetry ? <Button label={retryLabel} onPress={onRetry} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: palette.dangerSoft,
    marginBottom: spacing.md,
  },
  description: { marginTop: spacing.sm, maxWidth: 320 },
  action: { marginTop: spacing.lg },
});