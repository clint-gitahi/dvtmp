import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NetworkBanner } from '@shared/components';
import { palette } from '@shared/theme';
import { useIsOnline } from '@shared/hooks/useIsOnline';

type OnlineGateProps = {
  children: React.ReactNode;
};

export function OnlineGate({ children }: OnlineGateProps) {
  const isOnline = useIsOnline();
  const insets = useSafeAreaInsets();

  if (isOnline) return <>{children}</>;

  return (
    <View style={styles.root}>
      <View style={[styles.bannerHost, { paddingTop: insets.top }]}>
        <NetworkBanner visible />
      </View>
      <SafeAreaInsetsContext.Provider value={{ ...insets, top: 0 }}>
        <View style={styles.flex}>{children}</View>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  bannerHost: { backgroundColor: palette.ink },
});