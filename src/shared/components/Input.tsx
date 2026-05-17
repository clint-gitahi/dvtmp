import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { palette, radii, spacing } from '@shared/theme';
import { Text } from './Text';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helper?: string;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, helper, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View style={styles.root}>
      {label ? (
        <Text variant="captionStrong" color="inkSoft" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={palette.inkMuted}
        {...rest}
        onFocus={e => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          hasError && styles.inputError,
          style,
        ]}
      />
      {hasError ? (
        <Text variant="caption" color="danger" style={styles.feedback}>
          {error}
        </Text>
      ) : helper ? (
        <Text variant="caption" color="inkMuted" style={styles.feedback}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
  label: {},
  input: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.surface,
    color: palette.ink,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: palette.primary,
  },
  inputError: {
    borderColor: palette.danger,
  },
  feedback: {
    minHeight: 18,
  },
});