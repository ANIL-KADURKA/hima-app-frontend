import { AuthApiError } from '@/auth/api/authApi';
import { GoogleSignInError } from '@/auth/services/googleSignIn';
import { FIREBASE_AUTH_ERROR_CODES } from '@/auth/constants/auth';
import { i18n } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';

type CodedError = Error & { code: string };

const API_ERROR_MESSAGES: Readonly<Partial<Record<number, TranslationKey>>> = {
  401: 'auth.api.requestFailed',
  403: 'auth.api.accountUnavailable',
  409: 'auth.api.accountConflict',
  503: 'auth.api.serviceUnavailable',
};

const API_CODE_MESSAGES: Readonly<Partial<Record<AuthApiError['code'], TranslationKey>>> = {
  configuration_missing: 'auth.api.configurationMissing',
  invalid_response: 'auth.api.invalidResponse',
  invalid_session: 'auth.session.invalid',
  secure_storage_failed: 'auth.api.secureStorageFailed',
};

const FIREBASE_ERROR_MESSAGES: Readonly<Record<string, TranslationKey>> = {
  [FIREBASE_AUTH_ERROR_CODES.invalidPhoneNumber]: 'auth.firebase.phoneInvalid',
  [FIREBASE_AUTH_ERROR_CODES.invalidVerificationCode]: 'auth.firebase.invalidCode',
  [FIREBASE_AUTH_ERROR_CODES.codeExpired]: 'auth.firebase.expiredCode',
  [FIREBASE_AUTH_ERROR_CODES.networkRequestFailed]: 'auth.api.networkError',
};

const FLOW_ERROR_MESSAGES = {
  verification_unavailable: 'auth.session.verificationUnavailable',
  token_unavailable: 'auth.session.tokenUnavailable',
} as const satisfies Record<string, TranslationKey>;

export class AuthFlowError extends Error {
  constructor(readonly code: keyof typeof FLOW_ERROR_MESSAGES) {
    super(i18n.t(FLOW_ERROR_MESSAGES[code]));
    this.name = 'AuthFlowError';
  }
}

function hasErrorCode(error: Error): error is CodedError {
  return 'code' in error && typeof error.code === 'string';
}

export function getAuthErrorMessage(error: Error): string {
  if (error instanceof GoogleSignInError) {
    const messages: Readonly<Record<GoogleSignInError['code'], TranslationKey>> = {
      google_configuration_missing: 'auth.google.configurationMissing',
      google_cancelled: 'auth.google.cancelled',
      google_id_token_missing: 'auth.google.idTokenUnavailable',
      google_sign_in_failed: 'auth.google.signInFailed',
    };
    return i18n.t(messages[error.code]);
  }
  if (error instanceof AuthFlowError) return error.message;
  if (error instanceof AuthApiError) {
    const messageKey =
      API_CODE_MESSAGES[error.code] ??
      API_ERROR_MESSAGES[error.status] ??
      (error.status === 0 ? 'auth.api.networkError' : 'auth.api.requestFailed');
    return i18n.t(messageKey);
  }

  if (hasErrorCode(error)) {
    return i18n.t(FIREBASE_ERROR_MESSAGES[error.code] ?? 'auth.firebase.requestFailed');
  }
  return i18n.t('auth.api.networkError');
}
