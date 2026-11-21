import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { theme } from '@/shared/theme';

type ButtonProps = Omit<PressableProps, 'children'> & { label: string };

export function Button({ label, disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      style={(state) => [
        styles.button,
        state.pressed && styles.pressed,
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: theme.layout.inputHeight,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: theme.colors.primaryDark },
  disabled: {
    backgroundColor: theme.colors.surfaceDisabled,
  },
  label: { ...theme.typography.button, color: theme.colors.textOnPrimary },
});
