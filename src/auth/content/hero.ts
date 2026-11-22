import { colors } from '@/shared/theme';
import { i18n } from '@/shared/i18n';

export type HeroIconName = 'chat' | 'video' | 'voice' | 'heart' | 'star' | 'infinity';

export type HeroFeature = {
  icon: HeroIconName;
  label: string;
  colors: readonly [string, string];
};

type Decoration = {
  icon: HeroIconName;
  color: string;
  background: string;
  top: number;
  left?: number;
  right?: number;
};

export const heroFeatures: readonly HeroFeature[] = [
  { icon: 'chat', label: i18n.t('auth.hero.chat'), colors: ['#FF99D6', colors.primary] },
  { icon: 'video', label: i18n.t('auth.hero.video'), colors: ['#9BC9FF', '#287BEE'] },
  { icon: 'voice', label: i18n.t('auth.hero.voice'), colors: ['#6CF0BC', '#00C58B'] },
  { icon: 'heart', label: i18n.t('auth.hero.connect'), colors: ['#D7AEFF', '#914AFF'] },
];

export const heroDecorations: readonly Decoration[] = [
  {
    icon: 'chat',
    color: colors.primary,
    background: '#FFE6F3',
    top: 40,
    left: 14,
  },
  {
    icon: 'video',
    color: colors.accent,
    background: '#E2EDFF',
    top: 40,
    right: 14,
  },
  { icon: 'star', color: '#F5A623', background: '#FFF3D5', top: 95, left: 63 },
  {
    icon: 'infinity',
    color: '#F48223',
    background: '#FFECDC',
    top: 90,
    right: 68,
  },
  {
    icon: 'voice',
    color: '#00C878',
    background: '#DDFBEA',
    top: 140,
    left: 14,
  },
  {
    icon: 'heart',
    color: '#9B50F5',
    background: '#F0E8FF',
    top: 142,
    right: 14,
  },
];

export const heroSparkles = [
  { top: 88, left: 109, color: '#FFC761' },
  { top: 139, left: 108, color: '#00D7A2' },
  { top: 46, right: 68, color: '#FF62B5' },
  { top: 111, right: 118, color: '#FF8851' },
  { top: 145, right: 119, color: '#D2B6FF' },
] as const;
