import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Screen, Text } from '@shared/components';
import { spacing } from '@shared/theme';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSession } from '@features/auth/slice';

export function LoginScreen() {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(
      setSession({
        user: { id: 'gitahi-user', email: 'gitahi@gmail.com', name: 'Gitahi Clinton' },
        token: 'placeholder-token',
      }),
    );
  };

  return (
    <Screen padded>
      <View style={styles.body}>
        <Text variant="display">Welcome</Text>
        <Text variant="body" color="inkMuted" style={styles.subtitle}>
          Sign in and get the best experience on marketplace.
        </Text>
        <Button
          label="Sign in"
          onPress={handleLogin}
          fullWidth
          style={styles.loginBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.sm },
  subtitle: { marginBottom: spacing.xl },
  loginBtn: { marginTop: spacing.lg },
});