import {
  getAuth,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from '@react-native-firebase/auth';
import { getApps } from '@react-native-firebase/app';
import { E164_PHONE_NUMBER_PATTERN, FIREBASE_AUTH_ERROR_CODES } from '@/auth/constants/auth';
import { logAuthDebug } from '@/auth/utils/authDebug';
import { i18n } from '@/shared/i18n';

class PhoneNumberError extends Error {
  readonly code = FIREBASE_AUTH_ERROR_CODES.invalidPhoneNumber;

  constructor() {
    super(i18n.t('auth.firebase.phoneInvalid'));
    this.name = 'PhoneNumberError';
  }
}

export async function requestPhoneCode(phoneNumber: string): Promise<ConfirmationResult> {
  if (!E164_PHONE_NUMBER_PATTERN.test(phoneNumber)) throw new PhoneNumberError();

  const apps = getApps();
  logAuthDebug('firebase.native_app_registry', {
    appCount: apps.length,
    defaultAppAvailable: apps.some((app) => app.name === '[DEFAULT]'),
    appNames: apps.map((app) => app.name).join(','),
  });

  const auth = getAuth();
  logAuthDebug('firebase.auth_instance_ready');
  return signInWithPhoneNumber(auth, phoneNumber);
}
