import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { registrationContent as content } from '@/auth/content/registration';
import { phoneCountry, symbols } from '@/shared/content/common';

import { Checkbox } from '@/shared/components/Checkbox';
import { RegistrationHero } from '@/auth/components/RegistrationHero';

import { theme } from '@/shared/theme';

const { colors, spacing, radius, typography } = theme;

export function RegistrationScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);
  const [phone, setPhone] = useState('');
  const [hasReferral, setHasReferral] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [showNotice, setShowNotice] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const canContinue = /^\d{10}$/.test(phone) && accepted;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.fill}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.page, { width: contentWidth }]}>
            <RegistrationHero width={contentWidth} />

            <View style={styles.form}>
              <Text accessibilityRole="header" style={styles.title}>
                {content.title}
              </Text>
              <Text style={styles.subtitle}>{content.subtitle}</Text>

              <View style={styles.fieldSection}>
                <Text nativeID="mobile-label" style={styles.label}>
                  {content.phoneLabel}
                </Text>
                <View style={styles.phoneField}>
                  <Text accessibilityLabel={phoneCountry.name} style={styles.flag}>
                    {phoneCountry.flag}
                  </Text>
                  <Text style={styles.countryCode}>{phoneCountry.dialCode}</Text>
                  <View style={styles.divider} />
                  <TextInput
                    accessibilityLabel={content.phoneLabel}
                    accessibilityLabelledBy="mobile-label"
                    placeholder={content.phonePlaceholder}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    autoComplete="tel-national"
                    textContentType="telephoneNumber"
                    maxLength={10}
                    value={phone}
                    onChangeText={(value) => setPhone(value.replace(/\D/g, ''))}
                    selectionColor={colors.primary}
                    style={styles.phoneInput}
                  />
                </View>
                <Text style={styles.helper}>{content.phoneHelper}</Text>
              </View>

              <Checkbox
                checked={hasReferral}
                label={content.referralToggle}
                onChange={setHasReferral}
              />
              {hasReferral && (
                <TextInput
                  accessibilityLabel={content.referralLabel}
                  placeholder={content.referralPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={styles.referralInput}
                />
              )}

              <Checkbox
                checked={accepted}
                label={content.consentLabel}
                onChange={setAccepted}
                labelStyle={styles.consentText}
              >
                {content.consent.map((segment) => (
                  <Text key={segment.text} style={segment.highlighted ? styles.policy : undefined}>
                    {segment.text}
                  </Text>
                ))}
              </Checkbox>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !canContinue }}
                disabled={!canContinue}
                onPress={() => {
                  Keyboard.dismiss();
                  router.push({ pathname: '/otp', params: { phone } });
                }}
                style={[styles.submit, canContinue && styles.submitEnabled]}
              >
                <Text style={styles.submitLabel}>{content.submit}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        {showNotice && !keyboardVisible && (
          <SafeAreaView edges={['bottom']} style={[styles.noticeSafeArea, { width: contentWidth }]}>
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
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  page: { flexGrow: 1, backgroundColor: colors.background },
  form: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing['xl'],
  },
  fieldSection: { gap: spacing.md },
  label: { ...typography.body, fontWeight: '600', color: colors.text },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  flag: { fontSize: 23 },
  countryCode: { ...typography.body, fontWeight: '700', color: colors.text },
  divider: { height: 24, width: 1, backgroundColor: colors.border },
  phoneInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  helper: {
    ...typography.label,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  referralInput: {
    ...typography.body,
    borderWidth: 1,
    minHeight: 52,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  consentText: { ...typography.caption, flex: 1, color: colors.textSecondary },
  policy: { color: colors.primaryDark },
  submit: {
    minHeight: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceDisabled,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  submitEnabled: { backgroundColor: colors.primary },
  submitLabel: {
    ...typography.button,
    letterSpacing: 1,
    color: colors.textOnPrimary,
  },
  noticeSafeArea: {
    alignSelf: 'center',
    flexShrink: 0,
    backgroundColor: colors.noticeBackground,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.noticeBackground,
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
  dismissText: { fontSize: 30, color: colors.textOnPrimary, fontWeight: '300' },
});
