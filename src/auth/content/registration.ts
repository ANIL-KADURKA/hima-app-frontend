import { brandContent } from '@/shared/content/common';
import { i18n } from '@/shared/i18n';

export const registrationContent = {
  title: i18n.t('auth.registration.title'),
  subtitle: i18n.t('auth.registration.subtitle'),
  phoneLabel: i18n.t('auth.registration.phoneLabel'),
  phonePlaceholder: i18n.t('auth.registration.phonePlaceholder'),
  phoneHelper: i18n.t('auth.registration.phoneHelper'),
  referralToggle: i18n.t('auth.registration.referralToggle'),
  referralLabel: i18n.t('auth.registration.referralLabel'),
  referralPlaceholder: i18n.t('auth.registration.referralPlaceholder'),
  consentLabel: i18n.t('auth.registration.consentLabel'),
  consent: [
    { text: i18n.t('auth.registration.consentPrefix'), highlighted: false },
    { text: i18n.t('auth.registration.terms'), highlighted: true },
    { text: i18n.t('auth.registration.consentJoiner'), highlighted: false },
    { text: i18n.t('auth.registration.guidelines'), highlighted: true },
    {
      text: i18n.t('auth.registration.consentSuffix', { brand: brandContent.name }),
      highlighted: false,
    },
  ],
  submit: i18n.t('auth.registration.submit'),
  sendingCode: i18n.t('auth.common.sendingCode'),
  google: i18n.t('auth.registration.google'),
  googleLoading: i18n.t('auth.registration.googleLoading'),
  or: i18n.t('auth.registration.or'),
  notice: i18n.t('auth.registration.notice'),
  dismissNotice: i18n.t('auth.registration.dismissNotice'),
} as const;
