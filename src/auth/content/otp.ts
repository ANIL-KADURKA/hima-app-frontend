import { phoneCountry } from '@/shared/content/common';

export const otpContent = {
  title: 'Verify your number',
  subtitle: (length: number) => `Enter the ${length}-digit verification code for`,
  formatPhone: (phone: string) => `${phoneCountry.dialCode} ${phone.slice(0, 5)} ${phone.slice(5)}`,
  changeNumber: 'Change number',
  codeLabel: 'Verification code',
  digitLabel: (digit: number, length: number) => `Verification code digit ${digit} of ${length}`,
  inputLabel: (length: number) => `${length}-digit verification code`,
  inputHint: 'Enter or paste the code from your text message',
  helper: 'You can paste the code from your SMS.',
  resendHint: 'Didn’t receive a code?',
  resend: 'Resend OTP',
  resendLabel: 'Resend code',
  resendCountdown: (seconds: number) =>
    `Resend in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
  resendCountdownLabel: (seconds: number) => `Resend code in ${seconds} seconds`,
  deliveryUnavailable: 'SMS delivery is not available yet. Please try again later.',
  incorrectCode: 'Incorrect OTP. Please check the code and try again.',
  submit: 'Verify & continue',
  footer: 'Your next connection is just a step away.',
} as const;
