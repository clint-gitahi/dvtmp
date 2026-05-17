import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Pressable, View } from 'react-native';
import { Text } from '@shared/components';
import { palette, radii, spacing } from '@shared/theme';
import { useGetCategoriesQuery } from '@features/products/api/productsApi';

type CategoryChipsProps = {
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  const handleSelect = useCallback(
    (slug: string | null) => () => onSelect(slug),
    [onSelect],
  );

  if (isLoading) {
    return (
      <View style={styles.row}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.skeleton} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip label="All" selected={selected === null} onPress={handleSelect(null)} />
      {categories?.map(category => (
        <Chip
          key={category.slug}
          label={category.name}
          selected={selected === category.slug}
          onPress={handleSelect(category.slug)}
        />
      ))}
    </ScrollView>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
    >
      <Text
        variant="captionStrong"
        color={selected ? 'white' : 'inkSoft'}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipSelected: {
    backgroundColor: palette.ink,
    borderColor: palette.ink,
  },
  chipPressed: { 
    opacity: 0.7
  },
  skeleton: {
    width: 80,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: palette.surfaceMuted,
  },
});