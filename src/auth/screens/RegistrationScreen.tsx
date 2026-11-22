import { useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Keyboard, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { RegistrationForm } from '@/auth/components/RegistrationForm';
import { RegistrationHero } from '@/auth/components/RegistrationHero';
import { initialRegistrationValues, registrationFields } from '@/auth/config/registration';
import { registrationContent as content } from '@/auth/content/registration';
import { isRegistrationValid } from '@/auth/utils/registration';
import { getAuthErrorMessage } from '@/auth/utils/authErrorMessage';
import { logAuthDebug, logAuthWarning } from '@/auth/utils/authDebug';
import { useAuthSession } from '@/auth/hooks/useAuthSession';
import { useRequestPhoneCode } from '@/auth/hooks/usePhoneAuthMutations';
import { useGoogleSignInMutation } from '@/auth/hooks/useGoogleSignInMutation';
import { APP_ROUTES } from '@/routes';
import { Button } from '@/shared/components/Button';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { Screen } from '@/shared/components/Screen';
import { phoneCountry, symbols } from '@/shared/content/common';
import { colors, spacing, typography } from '@/shared/theme';

export function RegistrationScreen() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending, error: sessionError } = useAuthSession();
  const requestPhoneCode = useRequestPhoneCode();
  const googleSignIn = useGoogleSignInMutation();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const [values, setValues] = useState(initialRegistrationValues);
  const [showNotice, setShowNotice] = useState(true);
  const canContinue = isRegistrationValid(registrationFields, values);

  if (isSessionPending) return <LoadingIndicator />;
  if (session) return <Redirect href={APP_ROUTES.client} />;

  function continueToOtp() {
    logAuthDebug('registration.submit_pressed', {
      formValid: canContinue,
      phoneLength: values.phone.length,
      referralEnabled: values.hasReferral,
      referralCodeLength: values.referralCode.length,
      accepted: values.accepted,
      requestPending: requestPhoneCode.isPending,
    });
    if (!canContinue || requestPhoneCode.isPending) {
      logAuthDebug('registration.submit_blocked', {
        reason: requestPhoneCode.isPending ? 'request_pending' : 'form_invalid',
      });
      return;
    }
    Keyboard.dismiss();
    requestPhoneCode.reset();
    requestPhoneCode.mutate(`${phoneCountry.dialCode}${values.phone}`, {
      onSuccess: () => {
        logAuthDebug('registration.navigation_to_otp');
        router.push({
          pathname: APP_ROUTES.otp,
          params: {
            phone: values.phone,
            ...(values.hasReferral && values.referralCode.trim()
              ? { referralCode: values.referralCode.trim() }
              : {}),
          },
        });
      },
      onError: (error) => logAuthWarning('registration.request_code_failed', error),
    });
  }

  const message = googleSignIn.error
    ? getAuthErrorMessage(googleSignIn.error)
    : requestPhoneCode.error
      ? getAuthErrorMessage(requestPhoneCode.error)
      : sessionError
        ? getAuthErrorMessage(sessionError)
        : '';
  const isSendingCode = requestPhoneCode.isPending;

  return (
    <Screen
      variant="full"
      maxWidth={480}
      backgroundColor={colors.background}
      edges={['left', 'right']}
      hideFooterOnKeyboard
      footerBackgroundColor={colors.noticeBackground}
      footer={
        showNotice ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{content.notice}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={content.dismissNotice}
              onPress={() => {
                logAuthDebug('registration.notice_dismissed');
                setShowNotice(false);
              }}
              style={styles.dismiss}
            >
              <Text style={styles.dismissText}>{symbols.close}</Text>
            </Pressable>
          </View>
        ) : undefined
      }
    >
      <RegistrationHero width={contentWidth} />
      <View style={styles.form}>
        <Text accessibilityRole="header" style={styles.title}>
          {content.title}
        </Text>
        <Text style={styles.subtitle}>{content.subtitle}</Text>
        <RegistrationForm fields={registrationFields} values={values} onChange={setValues} />
        {message !== '' && (
          <Text accessibilityRole="alert" style={styles.message}>
            {message}
          </Text>
        )}
        <Button
          label={isSendingCode ? content.sendingCode : content.submit}
          disabled={!canContinue || isSendingCode || googleSignIn.isPending}
          onPress={continueToOtp}
          style={styles.submit}
        />
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{content.or}</Text>
          <View style={styles.divider} />
        </View>
        <Button
          variant="outline"
          label={content.google}
          loadingLabel={content.googleLoading}
          isLoading={googleSignIn.isPending}
          disabled={isSendingCode}
          leadingContent={
            <View style={styles.googleMark}>
              <Text style={styles.googleText}>G</Text>
            </View>
          }
          onPress={() => {
            requestPhoneCode.reset();
            googleSignIn.mutate();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  submit: {
    marginTop: spacing.sm,
  },
  googleMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    ...typography.button,
    color: '#4285F4',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
  },
  message: {
    ...typography.label,
    color: colors.error,
    marginTop: spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  noticeText: {
    flex: 1,
    textAlign: 'center',
    color: colors.textOnPrimary,
    fontSize: 13,
    lineHeight: 25,
    paddingTop: spacing.md,
  },
  dismiss: {
    width: 40,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 30,
    color: colors.textOnPrimary,
    fontWeight: '300',
  },
});
