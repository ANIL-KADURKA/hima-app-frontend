import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import { symbols } from '@/shared/content/common';
import { colors, spacing, typography } from '@/shared/theme';

type CheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
  labelStyle?: StyleProp<TextStyle>;
};

export function Checkbox({ checked, label, onChange, children, labelStyle }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>{symbols.checkmark}</Text>}
      </View>
      <Text style={[styles.label, labelStyle]}>{children ?? label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    gap: spacing.md,
  },
  box: {
    width: 19,
    height: 19,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    fontSize: 16,
    lineHeight: 18,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  label: {
    ...typography.body,
    flex: 1,
    color: colors.text,
  },
});
