import Svg, { Circle, G, Path } from 'react-native-svg';

import { colors } from '@/shared/theme';

export function HimaMark({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" accessible={false}>
      <G stroke={colors.surface} strokeWidth={3} fill="none" strokeLinejoin="round">
        <Path d="M42 34a20 20 0 1 0-34 13L6 58l12-3a20 20 0 0 0 24-21Z" />
        <Path d="M36 40a20 20 0 1 1 34 25l2 11-12-3a20 20 0 0 1-24-33Z" />
      </G>
      {[18, 25, 32].map((cx) => (
        <Circle key={cx} cx={cx} cy={35} r={1.7} fill={colors.surface} />
      ))}
      {[48, 55, 62].map((cx) => (
        <Circle key={cx} cx={cx} cy={53} r={1.7} fill={colors.surface} />
      ))}
    </Svg>
  );
}
