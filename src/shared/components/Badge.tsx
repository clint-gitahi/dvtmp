import React, { memo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { palette, radii, spacing } from '@shared/theme';
import { Text } from './Text';

export type BadgeTone = 'danger' | 'warning' | 'success' | 'premium' | 'neutral';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
};

const TONE_STYLES: Record<BadgeTone, { bg: string; fg: keyof typeof palette }> = {
  danger: { bg: palette.danger, fg: 'white' },
  warning: { bg: palette.warningSoft, fg: 'warning' },
  success: { bg: palette.success, fg: 'white' },
  premium: { bg: palette.premium, fg: 'white' },
  neutral: { bg: palette.surfaceMuted, fg: 'inkSoft' },
};

function BadgeBase({ label, tone = 'neutral', style }: BadgeProps) {
  const { bg, fg } = TONE_STYLES[tone];
  return (
    <View style={[styles.root, { backgroundColor: bg }, style]}>
      <Text variant="micro" color={fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
});

export const Badge = memo(BadgeBase);