import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { clientHomeContent as content } from '@/client/content/home';
import { brandContent } from '@/shared/content/common';
import { HimaMark } from '@/shared/components/HimaMark';
import { Screen } from '@/shared/components/Screen';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { useAuthSession } from '@/auth/hooks/useAuthSession';
import { APP_ROUTES } from '@/routes';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { Button } from '@/shared/components/Button';
import { useLogoutMutation } from '@/auth/hooks/useLogoutMutation';
import { getAuthErrorMessage } from '@/auth/utils/authErrorMessage';

export function ClientHomeScreen() {
  const router = useRouter();
  const logoutInFlight = useRef(false);
  const { data: session, isPending } = useAuthSession();
  const logout = useLogoutMutation();
  if (isPending) return <LoadingIndicator />;
  if (!session) return <Redirect href={APP_ROUTES.register} />;

  return (
    <Screen>
      <View style={styles.header}>
        <Button
          label={logout.isPending ? content.loggingOut : content.logout}
          disabled={logout.isPending}
          onPress={() => {
            if (logoutInFlight.current) return;
            logoutInFlight.current = true;
            logout.mutate(session, {
              onSuccess: () => router.replace(APP_ROUTES.register),
              onSettled: () => {
                logoutInFlight.current = false;
              },
            });
          }}
          style={styles.logout}
        />
      </View>
      {logout.error && (
        <Text accessibilityRole="alert" style={styles.logoutError}>
          {getAuthErrorMessage(logout.error)}
        </Text>
      )}
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  logout: {
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  logoutError: {
    ...typography.label,
    color: colors.error,
    textAlign: 'right',
    width: '100%',
    marginBottom: spacing.sm,
  },
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
