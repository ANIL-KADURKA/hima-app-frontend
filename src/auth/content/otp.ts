import { phoneCountry } from '@/shared/content/common';
import { i18n } from '@/shared/i18n';

export const otpContent = {
  title: i18n.t('auth.otp.title'),
  subtitle: (length: number) => i18n.t('auth.otp.subtitle', { length }),
  formatPhone: (phone: string) => {
    const splitIndex = Math.ceil(phone.length / 2);
    return `${phoneCountry.dialCode} ${phone.slice(0, splitIndex)} ${phone.slice(splitIndex)}`;
  },
  changeNumber: i18n.t('auth.otp.changeNumber'),
  codeLabel: i18n.t('auth.otp.codeLabel'),
  digitLabel: (digit: number, length: number) => i18n.t('auth.otp.digitLabel', { digit, length }),
  inputLabel: (length: number) => i18n.t('auth.otp.inputLabel', { length }),
  inputHint: i18n.t('auth.otp.inputHint'),
  helper: i18n.t('auth.otp.helper'),
  resendHint: i18n.t('auth.otp.resendHint'),
  resend: i18n.t('auth.otp.resend'),
  sendingCode: i18n.t('auth.common.sendingCode'),
  verifying: i18n.t('auth.otp.verifying'),
  resendLabel: i18n.t('auth.otp.resendLabel'),
  resendCountdown: (seconds: number) => {
    const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return i18n.t('auth.otp.resendCountdown', { time });
  },
  resendCountdownLabel: (seconds: number) => i18n.t('auth.otp.resendCountdownLabel', { seconds }),
  submit: i18n.t('auth.otp.submit'),
  footer: i18n.t('auth.otp.footer'),
} as const;
