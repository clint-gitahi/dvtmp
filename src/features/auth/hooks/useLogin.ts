import { useCallback, useState } from 'react';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSession } from '@features/auth/slice';
import { AuthError, mockLogin, type LoginCredentials } from '@features/auth/api/mockAuth';

type LoginState = {
  isLoading: boolean;
  error: string | null;
};

export function useLogin() {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<LoginState>({ isLoading: false, error: null });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState({ isLoading: true, error: null });
      try {
        const result = await mockLogin(credentials);
        dispatch(setSession({ user: result.user, token: result.token }));
      } catch (err) {
        const message =
          err instanceof AuthError
            ? err.message
            : 'Could not sign you in. Please try again.';
        setState({ isLoading: false, error: message });
        return;
      }
      setState({ isLoading: false, error: null });
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  return { ...state, login, clearError };
}