import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@shared/theme';
import { Button } from './Button';
import { Text } from './Text';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.root}>
      <View style={styles.dot} />
      <Text variant="title" align="center">
        {title}
      </Text>
      {description ? (
        <Text variant="body" color="inkMuted" align="center" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
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
  dot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.surfaceMuted,
    marginBottom: spacing.lg,
  },
  description: { marginTop: spacing.sm, maxWidth: 320 },
  action: { marginTop: spacing.lg },
});