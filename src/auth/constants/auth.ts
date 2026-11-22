export const AUTH_API_PATHS = {
  googleSignIn: '/auth/google/',
  firebaseSignIn: '/auth/firebase/',
  refresh: '/auth/refresh/',
  logout: '/auth/logout/',
} as const;

export const FIREBASE_AUTH_ERROR_CODES = {
  invalidPhoneNumber: 'auth/invalid-phone-number',
  invalidVerificationCode: 'auth/invalid-verification-code',
  codeExpired: 'auth/code-expired',
  networkRequestFailed: 'auth/network-request-failed',
} as const;

export const E164_PHONE_NUMBER_PATTERN = /^\+[1-9]\d{6,14}$/;
export const PHONE_NUMBER_PATTERN = /^\d{10}$/;
export const RESEND_DELAY_SECONDS = 30;
export const DIGIT_POSITIONS = [0, 1, 2, 3, 4, 5] as const;
export const OTP_LENGTH = DIGIT_POSITIONS.length;
