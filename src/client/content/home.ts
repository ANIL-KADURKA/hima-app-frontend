import { i18n } from '@/shared/i18n';

export const clientHomeContent = {
  title: i18n.t('client.home.title'),
  subtitle: i18n.t('client.home.subtitle'),
  roleLabel: i18n.t('client.home.role'),
  logout: i18n.t('auth.logout'),
  loggingOut: i18n.t('auth.loggingOut'),
} as const;
