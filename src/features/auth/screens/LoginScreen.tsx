import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet,
  View,
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TextInput 
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Screen, Text, Input } from '@shared/components';
import { spacing, radii, palette } from '@shared/theme';
import { useLogin } from '@features/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@features/auth/loginSchema';

export function LoginScreen() {
  const { login, isLoading, error, clearError } = useLogin();
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const formValues = watch();

  useEffect(() => {
    if (error) clearError();
  }, [formValues.email, formValues.password, error, clearError]);

  const onSubmit = handleSubmit(values => {
    login(values);
  });

  return (
    <Screen padded>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="display">Welcome</Text>
            <Text variant="body" color="inkMuted" style={styles.subtitle}>
              Sign in to dvt marketplace.
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  ref={passwordRef}
                  label="Password"
                  placeholder="At least 6 characters"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="go"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={onSubmit}
                  error={errors.password?.message}
                />
              )}
            />

            {error ? (
              <View style={styles.errorBanner}>
                <Text variant="captionStrong" color="danger">
                  {error}
                </Text>
              </View>
            ) : null}

            <Button
              label="Sign in"
              onPress={onSubmit}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.cta}
            />

            <Text variant="caption" color="inkMuted" align="center" style={styles.hint}>
              Add email Plus 6 char password works.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { 
    flex: 1 
  },
  scroll: {
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingVertical: spacing.xl 
  },
  header: { 
    marginBottom: spacing.xl 
  },
  subtitle: { 
    marginTop: spacing.sm 
  },
  form: { 
    gap: spacing.md 
  },
  errorBanner: {
    backgroundColor: palette.dangerSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  cta: { 
    marginTop: spacing.sm 
  },
  hint: { 
    marginTop: spacing.lg 
  },
});