import { i18n } from '@/shared/i18n';

export const brandContent = {
  name: 'Hima',
  tagline: 'Where Feelings Connect',
} as const;

export const symbols = { checkmark: '✓', close: '×', sparkle: '✦' } as const;

export const phoneCountry = {
  name: i18n.t('common.country.india'),
  flag: '🇮🇳',
  dialCode: '+91',
} as const;
