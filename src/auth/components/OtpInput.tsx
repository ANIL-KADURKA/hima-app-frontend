import { useLayoutEffect, useRef, useState, type ComponentRef } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

import { DIGIT_POSITIONS, OTP_LENGTH } from '@/auth/constants/auth';
import { otpContent } from '@/auth/content/otp';
import { editOtp } from '@/auth/utils/otp';
import { colors, radius, spacing, typography } from '@/shared/theme';

type OtpInputProps = { value: string; onChange: (value: string) => void };

export function OtpInput({ value, onChange }: OtpInputProps) {
  const inputs = useRef<(ComponentRef<typeof TextInput> | null)[]>([]);
  const pendingFocus = useRef<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Move focus after the new value has rendered; focusing inside onChangeText
  // can otherwise use stale values and bounce back to the previous cell.
  useLayoutEffect(() => {
    if (pendingFocus.current !== null) {
      const index = pendingFocus.current;
      pendingFocus.current = null;
      inputs.current[index]?.focus();
    }
  }, [value]);

  function updateDigit(index: number, text: string) {
    const next = editOtp(value, index, text, OTP_LENGTH);
    if (next.value === value) {
      inputs.current[next.focusIndex]?.focus();
      return;
    }
    pendingFocus.current = next.focusIndex;
    onChange(next.value);
  }

  return (
    <View style={styles.digits}>
      {DIGIT_POSITIONS.map((index) => (
        <TextInput
          key={index}
          ref={(input) => {
            inputs.current[index] = input;
          }}
          accessibilityLabel={otpContent.digitLabel(index + 1, OTP_LENGTH)}
          accessibilityHint={otpContent.inputHint}
          value={value[index] ?? ''}
          onChangeText={(text) => updateDigit(index, text)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
              updateDigit(index - 1, '');
            }
          }}
          onFocus={() => {
            const target = Math.min(index, value.length);
            if (target !== index) inputs.current[target]?.focus();
            else setFocusedIndex(index);
          }}
          onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
          keyboardType="number-pad"
          textContentType={index === 0 ? 'oneTimeCode' : 'none'}
          autoComplete={
            index === 0 ? (Platform.OS === 'android' ? 'sms-otp' : 'one-time-code') : 'off'
          }
          autoCorrect={false}
          autoCapitalize="none"
          selectTextOnFocus
          selectionColor={colors.primary}
          style={[
            styles.cell,
            Boolean(value[index]) && styles.filled,
            focusedIndex === index && styles.active,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  digits: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    ...typography.heading,
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  filled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  active: {
    borderColor: colors.borderFocused,
    borderWidth: 2,
  },
});
