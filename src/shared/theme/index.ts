import { colors } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { typography } from './typography';

export { colors, radius, spacing, typography };

// A single light theme today; components consume these tokens directly.
export const theme = {
  colors,
  radius,
  spacing,
  typography,
  layout: { maxFormWidth: 440, minTouchTarget: 48, inputHeight: 56 },
} as const;

export type Theme = typeof theme;
