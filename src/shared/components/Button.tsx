import React, { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { palette, radii, spacing } from '@shared/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

function ButtonBase({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  fullWidth,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette_ = paletteFor(variant, !!isDisabled);
  const sizing = sizingFor(size);

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      android_ripple={{ color: palette_.ripple }}
      style={({ pressed }) => [
        styles.base,
        sizing,
        {
          backgroundColor: palette_.bg,
          borderColor: palette_.border,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette_.fg} />
      ) : (
        <View style={styles.content}>
          <Text variant={size === 'sm' ? 'captionStrong' : 'bodyStrong'} style={{ color: palette_.fg }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function paletteFor(variant: Variant, disabled: boolean) {
  if (disabled) {
    return { bg: palette.surfaceMuted, fg: palette.inkMuted, border: 'transparent', ripple: palette.surfaceMuted };
  }
  switch (variant) {
    case 'primary':
      return { bg: palette.primary, fg: palette.white, border: 'transparent', ripple: palette.primarySoft };
    case 'secondary':
      return { bg: palette.surfaceAlt, fg: palette.ink, border: palette.border, ripple: palette.surfaceMuted };
    case 'ghost':
      return { bg: 'transparent', fg: palette.primary, border: 'transparent', ripple: palette.primarySoft };
    case 'danger':
      return { bg: palette.danger, fg: palette.white, border: 'transparent', ripple: palette.dangerSoft };
  }
}

function sizingFor(size: Size): ViewStyle {
  switch (size) {
    case 'sm':
      return { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, minHeight: 32 };
    case 'lg':
      return { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl, minHeight: 52 };
    default:
      return { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, minHeight: 44 };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fullWidth: { alignSelf: 'stretch' },
});

export const Button = memo(ButtonBase);