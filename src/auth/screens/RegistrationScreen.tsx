import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Keyboard, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { RegistrationForm } from '@/auth/components/RegistrationForm';
import { RegistrationHero } from '@/auth/components/RegistrationHero';
import { initialRegistrationValues, registrationFields } from '@/auth/config/registration';
import { registrationContent as content } from '@/auth/content/registration';
import { isRegistrationValid } from '@/auth/utils/registration';
import { Button } from '@/shared/components/Button';
import { Screen } from '@/shared/components/Screen';
import { symbols } from '@/shared/content/common';
import { colors, spacing, typography } from '@/shared/theme';

export function RegistrationScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const [values, setValues] = useState(initialRegistrationValues);
  const [showNotice, setShowNotice] = useState(true);
  const canContinue = isRegistrationValid(registrationFields, values);

  function continueToOtp() {
    if (!canContinue) return;
    Keyboard.dismiss();
    router.push({
      pathname: '/otp',
      params: {
        phone: values.phone,
        ...(values.hasReferral && values.referralCode.trim()
          ? { referralCode: values.referralCode.trim() }
          : {}),
      },
    });
  }

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
              onPress={() => setShowNotice(false)}
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
        <Button
          label={content.submit}
          disabled={!canContinue}
          onPress={continueToOtp}
          style={styles.submit}
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
