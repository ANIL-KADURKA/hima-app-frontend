import { StyleSheet, Text, View } from 'react-native';
import { clientHomeContent as content } from '@/client/content/home';
import { brandContent } from '@/shared/content/common';
import { HimaMark } from '@/shared/components/HimaMark';
import { Screen } from '@/shared/components/Screen';
import { colors, radius, spacing, typography } from '@/shared/theme';

export function ClientHomeScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.logo}>
          <HimaMark size={56} />
        </View>
        <Text style={styles.brand}>{brandContent.name}</Text>
        <Text accessibilityRole="header" style={styles.heading}>
          {content.title}
        </Text>
        <Text style={styles.subtitle}>{content.subtitle}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{content.roleLabel}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    gap: spacing.lg,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: radius['2xl'],
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { ...typography.brand, color: colors.text },
  heading: { ...typography.heading, color: colors.text, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  badge: {
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  badgeLabel: { ...typography.label, color: colors.primaryDark },
});
