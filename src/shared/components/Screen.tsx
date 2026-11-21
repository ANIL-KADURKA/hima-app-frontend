import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useKeyboardVisible } from '@/shared/hooks/useKeyboardVisible';
import { theme } from '@/shared/theme';

type ScreenProps = {
  children: ReactNode;
  backgroundColor?: ColorValue;
  edges?: Edge[];
  variant?: 'centered' | 'full';
  maxWidth?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  footer?: ReactNode;
  footerBackgroundColor?: ColorValue;
  hideFooterOnKeyboard?: boolean;
};

export function Screen({
  children,
  backgroundColor = theme.colors.surface,
  edges,
  variant = 'centered',
  maxWidth = theme.layout.maxFormWidth,
  contentContainerStyle,
  scrollable = true,
  footer,
  footerBackgroundColor = backgroundColor,
  hideFooterOnKeyboard = false,
}: ScreenProps) {
  const keyboardVisible = useKeyboardVisible();
  const content = <View style={[styles.page, { maxWidth }]}>{children}</View>;
  const containerStyle = [
    styles.content,
    variant === 'centered' && styles.centered,
    contentContainerStyle,
  ];

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor }]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scrollable ? (
          <ScrollView
            style={styles.fill}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={containerStyle}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={containerStyle}>{content}</View>
        )}
        {footer && !(hideFooterOnKeyboard && keyboardVisible) && (
          <SafeAreaView
            edges={['bottom']}
            style={[styles.fixedFooter, { maxWidth, backgroundColor: footerBackgroundColor }]}
          >
            {footer}
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  centered: {
    padding: theme.spacing['2xl'],
    justifyContent: 'center',
  },
  page: {
    width: '100%',
  },
  fixedFooter: {
    width: '100%',
    alignSelf: 'center',
    flexShrink: 0,
  },
});
