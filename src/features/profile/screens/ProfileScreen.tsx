import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Screen, Text } from '@shared/components';
import { spacing } from '@shared/theme';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { clearSession } from '@features/auth/slice';

export function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);

  return (
    <Screen padded>
      <View style={styles.body}>
        <Text variant="display">Profile</Text>
        {user ? (
          <>
            <Text variant="body" color="inkMuted" style={styles.subtitle}>
              Signed in as {user.email}
            </Text>
            <Button
              label="Log out"
              variant="secondary"
              onPress={() => dispatch(clearSession())}
              style={styles.cta}
            />
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'flex-start', paddingTop: spacing.xl },
  subtitle: { marginTop: spacing.sm },
  cta: { marginTop: spacing.xl, alignSelf: 'flex-start' },
});