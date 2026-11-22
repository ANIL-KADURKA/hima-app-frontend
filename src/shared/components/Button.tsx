import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';

import { theme } from '@/shared/theme';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  loadingLabel?: string;
  leadingContent?: ReactNode;
};

export function Button({
  label,
  variant = 'primary',
  isLoading = false,
  loadingLabel,
  leadingContent,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: isLoading }}
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        variant === 'outline' && styles.outline,
        state.pressed && (variant === 'outline' ? styles.outlinePressed : styles.pressed),
        isDisabled && (variant === 'outline' ? styles.outlineDisabled : styles.disabled),
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <View style={styles.content}>
        {leadingContent !== undefined && (
          <View style={styles.leadingContent}>{leadingContent}</View>
        )}
        <Text style={[styles.label, variant === 'outline' && styles.outlineLabel]}>
          {isLoading ? (loadingLabel ?? label) : label}
        </Text>
      </View>
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
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  outlinePressed: { backgroundColor: theme.colors.primaryLight },
  outlineDisabled: { opacity: 0.65 },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingContent: {
    marginRight: theme.spacing.sm,
  },
  label: { ...theme.typography.button, color: theme.colors.textOnPrimary },
  outlineLabel: { color: theme.colors.text },
});
