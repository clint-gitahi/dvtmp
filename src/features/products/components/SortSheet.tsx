import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@shared/components';
import { palette, radii, spacing } from '@shared/theme';
import type { SortKey } from '@models/Product';

type SortOption = { value: SortKey | null; label: string };

const OPTIONS: SortOption[] = [
  { value: null, label: 'Default (relevance)' },
  { value: 'priceAsc', label: 'Price: low to high' },
  { value: 'priceDesc', label: 'Price: high to low' },
  { value: 'ratingDesc', label: 'Highest rated' },
];

type SortSheetProps = {
  visible: boolean;
  selected: SortKey | null;
  onSelect: (sort: SortKey | null) => void;
  onClose: () => void;
};

export function SortSheet({ visible, selected, onSelect, onClose }: SortSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text variant="title" style={styles.heading}>
            Sort by
          </Text>
          {OPTIONS.map(option => {
            const isSelected = option.value === selected;
            return (
              <Pressable
                key={option.label}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text variant={isSelected ? 'bodyStrong' : 'body'} color={isSelected ? 'primary' : 'ink'}>
                  {option.label}
                </Text>
                {isSelected ? (
                  <Text variant="bodyStrong" color="primary">
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.border,
    marginBottom: spacing.md,
  },
  heading: { 
    marginBottom: spacing.md 
  },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: { 
    backgroundColor: palette.primarySoft 
  },
  optionPressed: { 
    opacity: 0.7 
  },
});