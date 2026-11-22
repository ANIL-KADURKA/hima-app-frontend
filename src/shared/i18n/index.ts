const englishMessages = {
  'auth.app.restoreFailed': 'Could not restore your saved session. Please sign in again.',
  'auth.api.requestFailed': 'The authentication request failed. Please try again.',
  'auth.api.invalidResponse': 'The server returned an invalid response. Please try again.',
  'auth.api.networkError': 'Could not connect to the server. Check your connection and try again.',
  'auth.api.configurationMissing': 'The server URL is not configured for this app.',
  'auth.api.accountUnavailable': 'This account is unavailable. Please contact support.',
  'auth.api.accountConflict':
    'This phone number is linked to a conflicting account. Please contact support.',
  'auth.api.serviceUnavailable':
    'Authentication is temporarily unavailable. Please try again later.',
  'auth.api.secureStorageFailed': 'Could not securely save your session. Please try again.',
  'auth.firebase.invalidCode': 'Incorrect OTP. Please check the code and try again.',
  'auth.firebase.expiredCode': 'This OTP has expired. Request a new code and try again.',
  'auth.firebase.phoneInvalid': 'Enter a valid phone number, including its country code.',
  'auth.firebase.requestFailed':
    'We could not send an OTP. Please check your number and try again.',
  'auth.session.invalid': 'Your saved session is invalid. Please sign in again.',
  'auth.logout': 'Logout',
  'auth.loggingOut': 'Logging out…',
  'auth.session.tokenUnavailable': 'Firebase did not return an ID token. Please try again.',
  'auth.google.configurationMissing': 'Google sign-in is not configured. Please contact support.',
  'auth.google.cancelled': 'Google sign-in was cancelled.',
  'auth.google.idTokenUnavailable': 'Google did not return an ID token. Please try again.',
  'auth.google.signInFailed': 'Google sign-in failed. Please try again.',
  'auth.registration.google': 'Continue with Google',
  'auth.registration.googleLoading': 'Signing in with Google…',
  'auth.registration.or': 'or continue with',
  'auth.session.verificationUnavailable': 'Request a new verification code before continuing.',
  'auth.context.providerRequired': 'Authentication services are not available on this screen.',
  'auth.deviceName': '{platform} device',
  'auth.registration.title': 'Get Started',
  'auth.registration.subtitle': 'Enter your mobile number to continue',
  'auth.registration.phoneLabel': 'Mobile number',
  'auth.registration.phonePlaceholder': 'Enter mobile number',
  'auth.registration.phoneHelper': 'You will receive an OTP on this number.',
  'auth.registration.phoneHintInvalid':
    'The suggested phone number is not valid. Please enter it manually.',
  'auth.registration.consentRequired': 'Please accept the terms and conditions to continue.',
  'auth.registration.referralToggle': 'Have a referral code?',
  'auth.registration.referralLabel': 'Referral code',
  'auth.registration.referralPlaceholder': 'Enter referral code',
  'auth.registration.consentLabel':
    'Accept terms and conditions, community guidelines and moderation policy',
  'auth.registration.consentPrefix': 'I accept ',
  'auth.registration.terms': 'terms & conditions',
  'auth.registration.consentJoiner': ', and ',
  'auth.registration.guidelines': 'community guidelines & moderation policy',
  'auth.registration.consentSuffix': ' of {brand}.',
  'auth.registration.submit': 'Send OTP',
  'auth.common.sendingCode': 'Sending OTP…',
  'auth.registration.notice':
    'By proceeding, you agree to receive a verification SMS and accept the Terms of Service.',
  'auth.registration.dismissNotice': 'Dismiss verification notice',
  'auth.otp.title': 'Verify your number',
  'auth.otp.subtitle': 'Enter the {length}-digit verification code for',
  'auth.otp.changeNumber': 'Change number',
  'auth.otp.codeLabel': 'Verification code',
  'auth.otp.digitLabel': 'Verification code digit {digit} of {length}',
  'auth.otp.inputLabel': '{length}-digit verification code',
  'auth.otp.inputHint': 'Enter or paste the code from your text message',
  'auth.otp.helper': 'You can paste the code from your SMS.',
  'auth.otp.resendHint': 'Didn’t receive a code?',
  'auth.otp.resend': 'Resend OTP',
  'auth.otp.resendLabel': 'Resend code',
  'auth.otp.resendCountdown': 'Resend in {time}',
  'auth.otp.resendCountdownLabel': 'Resend code in {seconds} seconds',
  'auth.otp.verifying': 'Verifying…',
  'auth.otp.submit': 'Verify & continue',
  'auth.otp.footer': 'Your next connection is just a step away.',
  'auth.hero.chat': 'Chat',
  'auth.hero.video': 'Video',
  'auth.hero.voice': 'Voice',
  'auth.hero.connect': 'Connect',
  'common.country.india': 'India',
  'client.home.title': 'Welcome to your space',
  'client.home.subtitle': 'Where feelings connect. Your next connection starts here.',
  'client.home.role': 'Client',
} as const;

export type TranslationKey = keyof typeof englishMessages;
export type TranslationParameters = Readonly<Record<string, string | number>>;

function translate(key: TranslationKey, parameters: TranslationParameters = {}): string {
  return englishMessages[key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    String(parameters[name] ?? placeholder),
  );
}

export const i18n = {
  locale: 'en',
  t: translate,
} as const;
