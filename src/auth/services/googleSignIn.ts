import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export class GoogleSignInError extends Error {
  constructor(
    readonly code:
      | 'google_configuration_missing'
      | 'google_cancelled'
      | 'google_id_token_missing'
      | 'google_sign_in_failed',
    readonly nativeCode?: string,
  ) {
    super(code);
    this.name = 'GoogleSignInError';
  }
}

export async function signInWithGoogle(): Promise<string> {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

  if (!webClientId) throw new GoogleSignInError('google_configuration_missing');

  GoogleSignin.configure({
    webClientId,
    ...(Platform.OS === 'ios' && iosClientId ? { iosClientId } : {}),
  });

  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    }

    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') throw new GoogleSignInError('google_cancelled');
    if (!response.data.idToken) throw new GoogleSignInError('google_id_token_missing');
    return response.data.idToken;
  } catch (error) {
    if (error instanceof GoogleSignInError) throw error;
    const nativeCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : undefined;
    const signInError = new GoogleSignInError('google_sign_in_failed', nativeCode);
    if (error instanceof Error) signInError.cause = error;
    throw signInError;
  }
}
