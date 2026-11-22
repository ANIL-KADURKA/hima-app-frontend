import { useState } from 'react';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Keyboard, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { APP_ROUTES } from '@/routes';
import { OtpInput } from '@/auth/components/OtpInput';
import { RegistrationHero } from '@/auth/components/RegistrationHero';
import { OTP_LENGTH, PHONE_NUMBER_PATTERN } from '@/auth/constants/auth';
import { otpContent as content } from '@/auth/content/otp';
import { useResendCountdown } from '@/auth/hooks/useResendCountdown';
import { useAuthSession } from '@/auth/hooks/useAuthSession';
import { useRequestPhoneCode, useVerifyPhoneCode } from '@/auth/hooks/usePhoneAuthMutations';
import { useAuthStore } from '@/auth/store/authStore';
import { Screen } from '@/shared/components/Screen';
import { Button } from '@/shared/components/Button';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { phoneCountry } from '@/shared/content/common';
import { colors, spacing, typography } from '@/shared/theme';
import { getAuthErrorMessage } from '@/auth/utils/authErrorMessage';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';

export function OtpScreen() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending, error: sessionError } = useAuthSession();
  const verificationReady = useAuthStore((state) => state.verificationReady);
  const clearPhoneVerification = useAuthStore((state) => state.clearVerification);
  const requestPhoneCode = useRequestPhoneCode();
  const verifyPhoneCode = useVerifyPhoneCode();
  const params = useLocalSearchParams<{ phone?: string | string[] }>();
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const [code, setCode] = useState('');
  const { secondsRemaining, restart } = useResendCountdown();

  if (isSessionPending) return <LoadingIndicator />;
  if (session) return <Redirect href={APP_ROUTES.client} />;
  if (!PHONE_NUMBER_PATTERN.test(phone) || !verificationReady) {
    return <Redirect href={APP_ROUTES.register} />;
  }

  function changeNumber() {
    logAuthDebug('otp.change_number_pressed');
    Keyboard.dismiss();
    clearPhoneVerification();
    if (router.canGoBack()) router.back();
    else router.replace(APP_ROUTES.register);
  }

  function resendCode() {
    logAuthDebug('otp.resend_pressed', {
      secondsRemaining,
      requestPending: requestPhoneCode.isPending,
    });
    if (secondsRemaining > 0 || requestPhoneCode.isPending) {
      logAuthDebug('otp.resend_blocked', {
        reason: requestPhoneCode.isPending ? 'request_pending' : 'countdown_active',
      });
      return;
    }
    setCode('');
    requestPhoneCode.reset();
    verifyPhoneCode.reset();
    requestPhoneCode.mutate(`${phoneCountry.dialCode}${phone}`, {
      onSuccess: restart,
      onError: (error) => logAuthWarning('otp.resend_failed', error),
    });
  }

  function verifyCode() {
    logAuthDebug('otp.verify_pressed', {
      codeLength: code.length,
      expectedLength: OTP_LENGTH,
      verifyPending: verifyPhoneCode.isPending,
    });
    Keyboard.dismiss();
    if (verifyPhoneCode.isPending) {
      logAuthDebug('otp.verify_blocked', { reason: 'verification_pending' });
      return;
    }
    verifyPhoneCode.mutate(
      { code },
      {
        onSuccess: () => {
          logAuthDebug('otp.verify_flow_succeeded');
          router.replace(APP_ROUTES.client);
        },
        onError: (error) => logAuthWarning('otp.verify_flow_failed', error),
      },
    );
  }

  const error = verifyPhoneCode.error ?? requestPhoneCode.error ?? sessionError;
  const message = error ? getAuthErrorMessage(error) : '';
  const isSendingCode = requestPhoneCode.isPending;
  const isVerifying = verifyPhoneCode.isPending;

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
            logAuthDebug('otp.digits_changed', {
              codeLength: value.length,
              expectedLength: OTP_LENGTH,
            });
            setCode(value);
            verifyPhoneCode.reset();
            requestPhoneCode.reset();
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
            accessibilityState={{ disabled: secondsRemaining > 0 || isSendingCode }}
            disabled={secondsRemaining > 0 || isSendingCode}
            onPress={resendCode}
            style={styles.textButton}
          >
            <Text style={[styles.link, secondsRemaining > 0 && styles.muted]}>
              {isSendingCode
                ? content.sendingCode
                : secondsRemaining > 0
                  ? content.resendCountdown(secondsRemaining)
                  : content.resend}
            </Text>
          </Pressable>
        </View>
        {message !== '' && (
          <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        )}
        <Button
          label={isVerifying ? content.verifying : content.submit}
          disabled={code.length !== OTP_LENGTH || isVerifying}
          onPress={verifyCode}
        />
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
