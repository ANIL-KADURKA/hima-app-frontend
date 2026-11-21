import { useId, useState, type ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '@/shared/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  helper?: string;
  leading?: ReactNode;
  emphasized?: boolean;
};

export function TextField({
  label,
  helper,
  leading,
  emphasized = false,
  onFocus,
  onBlur,
  style,
  ...props
}: TextFieldProps) {
  const labelId = useId();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text nativeID={labelId} style={styles.label}>
        {label}
      </Text>
      <View style={[styles.container, (focused || emphasized) && styles.focused]}>
        {leading}
        <TextInput
          {...props}
          accessibilityLabel={label}
          accessibilityLabelledBy={labelId}
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.primary}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, style]}
        />
      </View>
      {helper && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  focused: {
    borderColor: colors.borderFocused,
  },
  input: {
    ...typography.body,
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  helper: {
    ...typography.label,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
