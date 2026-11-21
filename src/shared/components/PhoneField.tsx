import { StyleSheet, Text, View, type TextInputProps } from 'react-native';

import { TextField } from '@/shared/components/TextField';
import { phoneCountry } from '@/shared/content/common';
import { colors, typography } from '@/shared/theme';

type PhoneFieldProps = TextInputProps & { label: string; helper?: string };

export function PhoneField(props: PhoneFieldProps) {
  return (
    <TextField
      {...props}
      emphasized
      leading={
        <>
          <Text accessibilityLabel={phoneCountry.name} style={styles.flag}>
            {phoneCountry.flag}
          </Text>
          <Text style={styles.code}>{phoneCountry.dialCode}</Text>
          <View style={styles.divider} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  flag: {
    fontSize: 23,
  },
  code: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
});
