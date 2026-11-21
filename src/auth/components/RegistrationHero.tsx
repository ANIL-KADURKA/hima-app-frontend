import { useId } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import {
  heroFeatures,
  heroDecorations,
  heroSparkles,
  type HeroIconName,
  type HeroFeature,
} from '@/auth/content/hero';
import { brandContent, symbols } from '@/shared/content/common';
import { HimaMark } from '@/shared/components/HimaMark';
import { colors, radius, spacing, typography } from '@/shared/theme';

function FeatureIcon({ name, color, size }: { name: HeroIconName; color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessible={false}>
      {name === 'chat' && (
        <>
          <Path d="M9 9h46v35H27L9 57V9Z" fill={color} />
          <Path
            d="M19 22h26M19 30h26"
            stroke={color === colors.surface ? colors.primary : colors.surface}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </>
      )}
      {name === 'video' && (
        <>
          <Rect x={5} y={16} width={37} height={34} rx={8} fill={color} />
          <Path d="m41 26 17-9v31l-17-9Z" fill={color} />
          <Circle cx={16} cy={26} r={3} fill={colors.accent} />
        </>
      )}
      {name === 'voice' && (
        <Path
          d="M17 5c-5 0-10 7-10 14 0 20 19 40 39 40 7 0 13-5 13-10 0-3-10-10-13-10-3 0-5 6-8 6-6 0-17-11-17-17 0-3 6-5 6-8 0-4-7-15-10-15Z"
          fill={color}
        />
      )}
      {name === 'heart' && (
        <Path d="M32 55 10 34C-8 16 17-3 32 14 47-3 72 16 54 34Z" fill={color} />
      )}
      {name === 'star' && (
        <Path d="m32 4 8 18 20 2-15 14 4 21-17-10-17 10 4-21L4 24l20-2Z" fill={color} />
      )}
      {name === 'infinity' && (
        <Path
          d="M32 32c-8-12-12-15-18-15-16 0-16 30 0 30 6 0 12-7 18-15s12-15 18-15c16 0 16 30 0 30-6 0-10-3-18-15Z"
          stroke={color}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

function FeatureTile({ feature, size }: { feature: HeroFeature; size: number }) {
  const gradientId = useId();
  return (
    <View style={styles.feature}>
      <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.3 }]}>
        <Svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          style={StyleSheet.absoluteFill}
          accessible={false}
        >
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0.7" y2="1">
              <Stop offset="0" stopColor={feature.colors[0]} />
              <Stop offset="1" stopColor={feature.colors[1]} />
            </LinearGradient>
          </Defs>
          <Rect width={64} height={64} rx={19} fill={`url(#${gradientId})`} />
        </Svg>
        <FeatureIcon name={feature.icon} color={colors.surface} size={size * 0.5} />
      </View>
      <Text style={styles.featureLabel}>{feature.label}</Text>
    </View>
  );
}

function Decoration({
  icon,
  color,
  background,
  style,
}: {
  icon: HeroIconName;
  color: string;
  background: string;
  style: { top: number; left?: number; right?: number };
}) {
  return (
    <View style={[styles.decoration, { backgroundColor: background }, style]}>
      <FeatureIcon name={icon} color={color} size={22} />
    </View>
  );
}

export function RegistrationHero({ width }: { width: number }) {
  const scale = width / 390;
  return (
    <View style={[styles.hero, { paddingTop: 52 * scale, paddingBottom: 30 * scale }]}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={StyleSheet.absoluteFill}
      >
        {heroDecorations.map((decoration) => (
          <Decoration
            key={decoration.icon}
            icon={decoration.icon}
            color={decoration.color}
            background={decoration.background}
            style={{
              top: decoration.top * scale,
              left: decoration.left === undefined ? undefined : decoration.left * scale,
              right: decoration.right === undefined ? undefined : decoration.right * scale,
            }}
          />
        ))}
        {heroSparkles.map((sparkle) => (
          <Text
            key={`${sparkle.top}-${sparkle.color}`}
            style={[
              styles.sparkle,
              {
                top: sparkle.top * scale,
                left: 'left' in sparkle ? sparkle.left * scale : undefined,
                right: 'right' in sparkle ? sparkle.right * scale : undefined,
                color: sparkle.color,
              },
            ]}
          >
            {symbols.sparkle}
          </Text>
        ))}
      </View>
      <View
        style={[styles.logo, { width: 72 * scale, height: 72 * scale, borderRadius: 21 * scale }]}
      >
        <HimaMark size={38 * scale} />
      </View>
      <Text
        accessibilityRole="header"
        style={[styles.brand, { fontSize: 29 * scale, lineHeight: 38 * scale }]}
      >
        {brandContent.name}
      </Text>
      <Text style={styles.tagline}>{brandContent.tagline}</Text>
      <View style={styles.features}>
        {heroFeatures.map((feature) => (
          <FeatureTile key={feature.label} feature={feature} size={48 * scale} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    boxShadow: '0px 5px 12px rgba(57, 0, 82, 0.15)',
  },
  brand: {
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    letterSpacing: -1,
  },
  tagline: {
    ...typography.label,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  feature: { alignItems: 'center', gap: spacing.sm },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px rgba(57, 0, 82, 0.1)',
  },
  featureLabel: { ...typography.label, fontWeight: '400', color: colors.text },
  decoration: {
    position: 'absolute',
    width: 40,
    height: 42,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: { position: 'absolute', fontSize: 20 },
});
