import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { palette, radii, spacing } from '@shared/theme';
import { Text } from './Text';

type SearchBarProps = TextInputProps & {
  onClear?: () => void;
};

export const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar(
  { value, onClear, style, ...rest },
  ref,
) {
  const showClear = Boolean(value && onClear);
  return (
    <View style={[styles.root, style]}>
      <Text variant="bodyStrong" color="inkMuted">⌕</Text>
      <TextInput
        ref={ref}
        value={value}
        placeholderTextColor={palette.inkMuted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
        {...rest}
      />
      {showClear ? (
        <Pressable onPress={onClear} hitSlop={8} style={styles.clear}>
          <Text variant="captionStrong" color="inkMuted">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
    minHeight: 44,
  },
  input: {
    flex: 1,
    color: palette.ink,
    fontSize: 15,
    paddingVertical: 0,
  },
  clear: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
  },
});