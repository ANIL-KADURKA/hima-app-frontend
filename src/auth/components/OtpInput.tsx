import { otpContent } from '@/auth/content/otp';
// import { DIGIT_POSITIONS, OTP_LENGTH } from '@/shared/constants/common';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { DIGIT_POSITIONS, OTP_LENGTH } from '../constants/auth';

type OtpInputProps = { value: string; onChange: (value: string) => void };

export function OtpInput({ value, onChange }: OtpInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={styles.digits}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {DIGIT_POSITIONS.map((index) => (
          <View
            key={index}
            style={[
              styles.cell,
              value[index] && styles.filled,
              focused && index === Math.min(value.length, OTP_LENGTH - 1) && styles.active,
            ]}
          >
            <Text style={styles.digit}>{value[index] ?? ''}</Text>
          </View>
        ))}
      </View>
      <TextInput
        accessibilityLabel={otpContent.inputLabel(OTP_LENGTH)}
        accessibilityHint={otpContent.inputHint}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        autoCorrect={false}
        autoCapitalize="none"
        caretHidden
        selectTextOnFocus
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor="transparent"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative' },
  digits: { flexDirection: 'row', gap: spacing.sm },
  cell: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  filled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  active: { borderColor: colors.borderFocused, borderWidth: 2 },
  digit: { ...typography.heading, color: colors.text },
  input: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 24,
    color: 'transparent',
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
  },
});
