import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { AUTH_STORAGE_KEYS } from '@/auth/constants/storage';
import { AUTH_API_PATHS } from '@/auth/constants/auth';
import type { AuthSession, AuthenticatedUser, TokenResponse } from '@/auth/types/session';
import { isJsonObject, parseJson, type JsonValue } from '@/shared/utils/json';
import { i18n } from '@/shared/i18n';
import type { TranslationKey } from '@/shared/i18n';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';

type ProviderSignInRequest = {
  id_token: string;
  device_id: string;
  device_name: string;
  platform: string;
  app_version?: string;
};

type RefreshRequest = {
  refresh_token: string;
};

type ApiErrorCode =
  | 'configuration_missing'
  | 'invalid_response'
  | 'invalid_session'
  | 'request_failed'
  | 'secure_storage_failed';

const API_ERROR_MESSAGES: Readonly<Record<ApiErrorCode, TranslationKey>> = {
  configuration_missing: 'auth.api.configurationMissing',
  invalid_response: 'auth.api.invalidResponse',
  invalid_session: 'auth.session.invalid',
  request_failed: 'auth.api.requestFailed',
  secure_storage_failed: 'auth.api.secureStorageFailed',
};

export class AuthApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
  ) {
    super(i18n.t(API_ERROR_MESSAGES[code]));
    this.name = 'AuthApiError';
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
  if (!baseUrl) throw new AuthApiError(0, 'configuration_missing');
  return baseUrl;
}

function readAuthenticatedUser(value: JsonValue): AuthenticatedUser | null {
  if (!isJsonObject(value)) return null;

  const { id, full_name, email, phone_number } = value;
  if (
    typeof id !== 'string' ||
    (typeof full_name !== 'string' && full_name !== null) ||
    (typeof email !== 'string' && email !== null) ||
    (typeof phone_number !== 'string' && phone_number !== null)
  ) {
    return null;
  }

  return { id, full_name, email, phone_number };
}

function readTokenResponse(value: JsonValue): TokenResponse | null {
  if (!isJsonObject(value)) return null;

  const { token_type, access_token, refresh_token, expires_in, session_id, user } = value;
  const authenticatedUser = readAuthenticatedUser(user);
  if (
    typeof token_type !== 'string' ||
    typeof access_token !== 'string' ||
    typeof refresh_token !== 'string' ||
    typeof expires_in !== 'number' ||
    !Number.isFinite(expires_in) ||
    expires_in <= 0 ||
    typeof session_id !== 'string' ||
    authenticatedUser === null
  ) {
    return null;
  }

  return {
    token_type,
    access_token,
    refresh_token,
    expires_in,
    session_id,
    user: authenticatedUser,
  };
}

async function postJson<T>(
  path: string,
  request: ProviderSignInRequest | RefreshRequest,
  readResponse: (value: JsonValue) => T | null,
): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;
  const startedAt = Date.now();
  logAuthDebug('api.request_started', { method: 'POST', url });
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch (error) {
    logAuthWarning('api.network_error', error);
    throw error;
  }
  logAuthDebug('api.response_received', {
    method: 'POST',
    path,
    status: response.status,
    durationMs: Date.now() - startedAt,
  });
  if (!response.ok) throw new AuthApiError(response.status, 'request_failed');

  try {
    const body = parseJson(await response.text());
    const result = readResponse(body);
    if (result === null) throw new AuthApiError(response.status, 'invalid_response');
    logAuthDebug('api.response_validated', { path, status: response.status });
    return result;
  } catch (error) {
    if (error instanceof AuthApiError && error.code === 'invalid_response') {
      logAuthWarning('api.invalid_response', error);
    }
    if (error instanceof AuthApiError) throw error;
    logAuthWarning('api.response_parse_failed', error);
    throw new AuthApiError(response.status, 'invalid_response');
  }
}

function toSession(response: TokenResponse): AuthSession {
  return { ...response, expires_at: Date.now() + response.expires_in * 1000 };
}

async function getDeviceId(): Promise<string> {
  const existingId = await runSecureStoreOperation(() =>
    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.deviceId),
  );
  if (existingId !== null) return existingId;

  const deviceId = Crypto.randomUUID();
  await runSecureStoreOperation(() =>
    SecureStore.setItemAsync(AUTH_STORAGE_KEYS.deviceId, deviceId),
  );
  return deviceId;
}

export async function signInWithFirebaseToken(idToken: string): Promise<AuthSession> {
  const request: ProviderSignInRequest = {
    id_token: idToken,
    device_id: await getDeviceId(),
    device_name: i18n.t('auth.deviceName', { platform: Platform.OS }),
    platform: Platform.OS,
    ...(Constants.expoConfig?.version ? { app_version: Constants.expoConfig.version } : {}),
  };
  const response = await postJson(AUTH_API_PATHS.firebaseSignIn, request, readTokenResponse);
  return toSession(response);
}

export async function signInWithGoogleToken(idToken: string): Promise<AuthSession> {
  const request: ProviderSignInRequest = {
    id_token: idToken,
    device_id: await getDeviceId(),
    device_name: i18n.t('auth.deviceName', { platform: Platform.OS }),
    platform: Platform.OS,
    ...(Constants.expoConfig?.version ? { app_version: Constants.expoConfig.version } : {}),
  };
  const response = await postJson(AUTH_API_PATHS.googleSignIn, request, readTokenResponse);
  return toSession(response);
}

export async function refreshAuthSession(refreshToken: string): Promise<AuthSession> {
  const request: RefreshRequest = { refresh_token: refreshToken };
  const response = await postJson(AUTH_API_PATHS.refresh, request, readTokenResponse);
  return toSession(response);
}

export async function restoreAuthSession(): Promise<AuthSession | null> {
  const storedSession = await runSecureStoreOperation(() =>
    SecureStore.getItemAsync(AUTH_STORAGE_KEYS.session),
  );
  if (storedSession === null) return null;

  try {
    const parsed = parseJson(storedSession);
    const session = readAuthSession(parsed);
    if (session === null) {
      await runSecureStoreOperation(() => SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.session));
      throw new AuthApiError(0, 'invalid_session');
    }

    if (session.expires_at > Date.now()) return session;

    const refreshedSession = await refreshAuthSession(session.refresh_token);
    await saveAuthSession(refreshedSession);
    return refreshedSession;
  } catch (error) {
    if (error instanceof AuthApiError) throw error;
    throw new AuthApiError(0, 'invalid_response');
  }
}

function readAuthSession(value: JsonValue): AuthSession | null {
  if (!isJsonObject(value)) return null;

  const { expires_at } = value;
  const tokenResponse = readTokenResponse(value);
  if (typeof expires_at !== 'number' || !Number.isFinite(expires_at) || tokenResponse === null) {
    return null;
  }

  return { ...tokenResponse, expires_at };
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await runSecureStoreOperation(() =>
    SecureStore.setItemAsync(AUTH_STORAGE_KEYS.session, JSON.stringify(session)),
  );
}

export async function clearAuthSession(): Promise<void> {
  await runSecureStoreOperation(() => SecureStore.deleteItemAsync(AUTH_STORAGE_KEYS.session));
}

export async function logoutAuthSession(session: AuthSession): Promise<void> {
  const url = `${getApiBaseUrl()}${AUTH_API_PATHS.logout}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  if (!response.ok) throw new AuthApiError(response.status, 'request_failed');
}

async function runSecureStoreOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch {
    throw new AuthApiError(0, 'secure_storage_failed');
  }
}
