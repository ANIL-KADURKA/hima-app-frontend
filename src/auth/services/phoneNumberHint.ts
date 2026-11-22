import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';

type PhoneNumberHintModule = {
  requestPhoneNumberHint: () => Promise<unknown>;
};

const phoneNumberHintModule =
  Platform.OS === 'android'
    ? requireOptionalNativeModule<PhoneNumberHintModule>('PhoneNumberHint')
    : null;

export function requestPhoneNumberHint(): Promise<string | null> {
  if (Platform.OS !== 'android') return Promise.resolve(null);
  if (!phoneNumberHintModule) {
    return Promise.reject(new Error('Android Phone Number Hint module is not installed.'));
  }

  return phoneNumberHintModule.requestPhoneNumberHint().then((hint) => {
    if (hint === null) return null;
    if (typeof hint !== 'string') {
      throw new TypeError('Android Phone Number Hint returned an invalid value.');
    }
    return hint;
  });
}
