import { useState } from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Keyboard, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { OtpInput } from '@/auth/components/OtpInput';
import { RegistrationHero } from '@/auth/components/RegistrationHero';
import { DEMO_OTP, OTP_LENGTH } from '@/auth/constants/auth';
import { otpContent as content } from '@/auth/content/otp';
import { useResendCountdown } from '@/auth/hooks/useResendCountdown';
import { Screen } from '@/shared/components/Screen';
import { Button } from '@/shared/components/Button';
import { colors, spacing, typography } from '@/shared/theme';

export function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string | string[] }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const { secondsRemaining, restart } = useResendCountdown();

  if (!/^\d{10}$/.test(phone)) {
    return <Redirect href="/register" />;
  }

  function changeNumber() {
    Keyboard.dismiss();
    if (router.canGoBack()) router.back();
    else router.replace('/register');
  }

  function resendCode() {
    if (secondsRemaining > 0) return;
    setCode('');
    restart();
    // Replace with the OTP request service when authentication is connected.
    setMessage(content.deliveryUnavailable);
  }

  function verifyCode() {
    Keyboard.dismiss();
    // Temporary demo code, not server-verified authentication.
    if (code === DEMO_OTP) {
      router.replace('/client');
      return;
    }
    setMessage(content.incorrectCode);
  }

  return (
    <Screen
      variant="full"
      maxWidth={480}
      backgroundColor={colors.background}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <RegistrationHero width={contentWidth} />
      <View style={styles.form}>
        <Text accessibilityRole="header" style={styles.title}>
          {content.title}
        </Text>
        <Text style={styles.subtitle}>{content.subtitle(OTP_LENGTH)}</Text>
        <View style={styles.numberRow}>
          <Text style={styles.phone}>{content.formatPhone(phone)}</Text>
          <Pressable accessibilityRole="button" onPress={changeNumber} style={styles.textButton}>
            <Text style={styles.link}>{content.changeNumber}</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>{content.codeLabel}</Text>
        <OtpInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setMessage('');
          }}
        />
        <Text style={styles.helper}>{content.helper}</Text>

        <View style={styles.resendRow}>
          <Text style={styles.resendHint}>{content.resendHint}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              secondsRemaining > 0
                ? content.resendCountdownLabel(secondsRemaining)
                : content.resendLabel
            }
            accessibilityState={{ disabled: secondsRemaining > 0 }}
            disabled={secondsRemaining > 0}
            onPress={resendCode}
            style={styles.textButton}
          >
            <Text style={[styles.link, secondsRemaining > 0 && styles.muted]}>
              {secondsRemaining > 0 ? content.resendCountdown(secondsRemaining) : content.resend}
            </Text>
          </Pressable>
        </View>
        {message !== '' && (
          <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        )}
        <Button label={content.submit} disabled={code.length !== OTP_LENGTH} onPress={verifyCode} />
        <Text style={styles.footer}>{content.footer}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['lg'],
    paddingBottom: spacing['2xl'],
    backgroundColor: colors.background,
  },
  title: {
    ...typography.heading,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: { ...typography.body, color: colors.textSecondary },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    marginBottom: spacing.xl,
  },
  phone: { ...typography.body, fontWeight: '600', color: colors.text },
  textButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  link: { ...typography.label, color: colors.primaryDark },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.md },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  resendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.sm,
    marginVertical: spacing.xl,
  },
  resendHint: {
    ...typography.label,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  muted: { color: colors.textSecondary },
  message: {
    ...typography.label,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  footer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
