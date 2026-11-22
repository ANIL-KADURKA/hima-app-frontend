import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut as signOutFirebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { AuthApiError, clearAuthSession, logoutAuthSession } from '@/auth/api/authApi';
import { AUTH_QUERY_KEYS } from '@/auth/constants/query';
import type { AuthSession } from '@/auth/types/session';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';
import { useAuthStore } from '@/auth/store/authStore';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AuthSession>({
    mutationFn: async (session) => {
      logAuthDebug('logout.started');

      void logoutAuthSession(session)
        .then(() => logAuthDebug('logout.api_succeeded'))
        .catch((error: unknown) => {
          if (error instanceof AuthApiError && error.status === 401) {
            logAuthDebug('logout.api_already_unauthenticated');
            return;
          }
          logAuthWarning('logout.api_failed', error);
        });

      try {
        await clearAuthSession();
      } catch (error) {
        logAuthWarning('logout.local_session_clear_failed', error);
      }

      try {
        if (GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();
      } catch (error) {
        logAuthWarning('logout.google_sign_out_failed', error);
      }

      try {
        await signOutFirebase(getAuth());
      } catch (error) {
        logAuthWarning('logout.firebase_sign_out_failed', error);
      }

      useAuthStore.getState().clearVerification();
      logAuthDebug('logout.local_succeeded');
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
    },
  });
}
