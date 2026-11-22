import { REGISTRATION_FIELD_TYPE } from '@/auth/config/registration';
import { StyleSheet, Text, View } from 'react-native';

import type { RegistrationField, RegistrationValues } from '@/auth/types/registration';
import { isFieldVisible } from '@/auth/utils/registration';
import { logAuthDebug } from '@/auth/utils/authDebug';
import { Checkbox } from '@/shared/components/Checkbox';
import { PhoneField } from '@/shared/components/PhoneField';
import { TextField } from '@/shared/components/TextField';
import { colors, spacing, typography } from '@/shared/theme';

type RegistrationFormProps = {
  fields: readonly RegistrationField[];
  values: RegistrationValues;
  onChange: (values: RegistrationValues) => void;
};

export function RegistrationForm({ fields, values, onChange }: RegistrationFormProps) {
  return (
    <View style={styles.fields}>
      {fields
        .filter((field) => isFieldVisible(field, values))
        .map((field) => {
          if (field.type === REGISTRATION_FIELD_TYPE.CHECKBOX) {
            return (
              <Checkbox
                key={field.name}
                label={field.label}
                checked={values[field.name]}
                onChange={(checked) => {
                  logAuthDebug('registration.field_changed', {
                    field: field.name,
                    checked,
                  });
                  onChange({ ...values, [field.name]: checked });
                }}
                labelStyle={field.segments ? styles.consent : undefined}
              >
                {field.segments?.map((segment) => (
                  <Text key={segment.text} style={segment.highlighted ? styles.policy : undefined}>
                    {segment.text}
                  </Text>
                ))}
              </Checkbox>
            );
          }
          const Input = field.type === REGISTRATION_FIELD_TYPE.PHONE ? PhoneField : TextField;
          return (
            <Input
              key={field.name}
              {...field.inputProps}
              label={field.label}
              placeholder={field.placeholder}
              helper={field.helper}
              value={values[field.name]}
              onChangeText={(text) => {
                const nextValue =
                  field.type === REGISTRATION_FIELD_TYPE.PHONE ? text.replace(/\D/g, '') : text;
                logAuthDebug('registration.field_changed', {
                  field: field.name,
                  valueLength: nextValue.length,
                  ...(field.type === REGISTRATION_FIELD_TYPE.PHONE
                    ? { validFormat: /^\d{10}$/.test(nextValue) }
                    : {}),
                });
                onChange({
                  ...values,
                  [field.name]: nextValue,
                });
              }}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: spacing.sm,
  },
  consent: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  policy: {
    color: colors.primaryDark,
  },
});
