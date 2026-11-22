import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveAuthSession, signInWithFirebaseToken } from '@/auth/api/authApi';
import { AUTH_QUERY_KEYS } from '@/auth/constants/query';
import type { AuthSession } from '@/auth/types/session';
import { AuthFlowError } from '@/auth/utils/authErrorMessage';
import { requestPhoneCode } from '@/auth/services/firebasePhoneAuth';
import { useAuthStore } from '@/auth/store/authStore';
import type { ConfirmationResult } from '@react-native-firebase/auth';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';

type VerifyPhoneCodeVariables = { code: string };

export function useRequestPhoneCode() {
  const setConfirmation = useAuthStore((state) => state.setConfirmation);

  return useMutation<ConfirmationResult, Error, string>({
    mutationFn: async (phoneNumber) => {
      logAuthDebug('firebase.request_code_started');
      try {
        return await requestPhoneCode(phoneNumber);
      } catch (error) {
        logAuthWarning('firebase.request_code_failed', error);
        console.log('firebase.request_code_failed', error);
        throw error;
      }
    },
    onSuccess: (confirmation) => {
      logAuthDebug('firebase.request_code_succeeded');
      setConfirmation(confirmation);
    },
  });
}

export function useVerifyPhoneCode() {
  const queryClient = useQueryClient();
  const mutation = useMutation<AuthSession, Error, VerifyPhoneCodeVariables>({
    mutationFn: async ({ code }) => {
      const { confirmation, pendingIdToken, setPendingIdToken } = useAuthStore.getState();
      if (pendingIdToken === null && confirmation === null) {
        logAuthDebug('firebase.verify_blocked', { reason: 'verification_unavailable' });
        throw new AuthFlowError('verification_unavailable');
      }

      let idToken = pendingIdToken;
      if (idToken === null && confirmation !== null) {
        logAuthDebug('firebase.verify_started');
        let credential;
        try {
          credential = await confirmation.confirm(code);
        } catch (error) {
          logAuthWarning('firebase.verify_failed', error);
          throw error;
        }
        logAuthDebug('firebase.verify_succeeded');
        idToken = await credential.user.getIdToken();
        logAuthDebug('firebase.id_token_received');
        setPendingIdToken(idToken);
      }

      if (idToken === null) throw new AuthFlowError('token_unavailable');

      logAuthDebug('backend.sign_in_started');
      let session: AuthSession;
      try {
        session = await signInWithFirebaseToken(idToken);
      } catch (error) {
        logAuthWarning('backend.sign_in_failed', error);
        throw error;
      }
      logAuthDebug('backend.sign_in_succeeded');

      try {
        await saveAuthSession(session);
      } catch (error) {
        logAuthWarning('auth.session_save_failed', error);
        throw error;
      }
      logAuthDebug('auth.session_saved');
      return session;
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, session);
      useAuthStore.getState().clearVerification();
    },
  });

  return mutation;
}
