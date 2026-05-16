import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { palette } from '@shared/theme';

type ScreenProps = {
  children: React.ReactNode;
  edges?: readonly Edge[];
  background?: keyof typeof palette;
  padded?: boolean;
  style?: ViewStyle;
};

export function Screen({
  children,
  edges = ['top', 'bottom'],
  background = 'surfaceAlt',
  padded = false,
  style,
}: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor: palette[background] }]}
    >
      <View style={[styles.body, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
  padded: { paddingHorizontal: 16 },
});