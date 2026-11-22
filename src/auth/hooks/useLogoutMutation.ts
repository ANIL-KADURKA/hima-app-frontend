import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuth, signOut as signOutFirebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { clearAuthSession, logoutAuthSession } from '@/auth/api/authApi';
import { AUTH_QUERY_KEYS } from '@/auth/constants/query';
import type { AuthSession } from '@/auth/types/session';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AuthSession>({
    mutationFn: async (session) => {
      logAuthDebug('logout.started');
      try {
        await logoutAuthSession(session);
        await clearAuthSession();

        if (GoogleSignin.hasPreviousSignIn()) {
          await GoogleSignin.signOut().catch((error) => {
            logAuthWarning('logout.google_sign_out_failed', error);
          });
        }
        await signOutFirebase(getAuth()).catch((error) => {
          logAuthWarning('logout.firebase_sign_out_failed', error);
        });

        logAuthDebug('logout.succeeded');
      } catch (error) {
        logAuthWarning('logout.failed', error);
        throw error instanceof Error ? error : new Error('Logout failed');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
    },
  });
}
