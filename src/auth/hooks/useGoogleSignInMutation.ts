import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveAuthSession, signInWithGoogleToken } from '@/auth/api/authApi';
import { AUTH_QUERY_KEYS } from '@/auth/constants/query';
import { signInWithGoogle } from '@/auth/services/googleSignIn';
import type { AuthSession } from '@/auth/types/session';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';

export function useGoogleSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthSession, Error, void>({
    mutationFn: async () => {
      logAuthDebug('google.sign_in_started');
      let idToken: string;
      try {
        idToken = await signInWithGoogle();
        logAuthDebug('google.id_token_received');
      } catch (error) {
        logAuthWarning('google.sign_in_failed', error);
        throw error;
      }

      let session: AuthSession;
      try {
        session = await signInWithGoogleToken(idToken);
      } catch (error) {
        logAuthWarning('backend.google_sign_in_failed', error);
        throw error;
      }

      await saveAuthSession(session);
      logAuthDebug('google.sign_in_succeeded');
      return session;
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, session);
    },
  });
}
