import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@shared/components';
import { palette, radii, spacing } from '@shared/theme';

type FilterButtonProps = {
  active: boolean;
  onPress: () => void;
};

export function FilterButton({ active, onPress }: FilterButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
      <Text variant="bodyStrong" color={active ? 'primary' : 'inkSoft'}>
        ⇅
      </Text>
      <Text variant="captionStrong" color={active ? 'primary' : 'inkSoft'}>
        Sort
      </Text>
      {active ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  pressed: { 
    opacity: 0.7 
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.primary,
    marginLeft: spacing.xs,
  },
});