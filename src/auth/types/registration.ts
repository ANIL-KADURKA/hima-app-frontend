import type { REGISTRATION_FIELD_TYPE } from '@/auth/config/registration';
import type { TextInputProps } from 'react-native';

export type RegistrationValues = {
  phone: string;
  hasReferral: boolean;
  referralCode: string;
  accepted: boolean;
};

type TextFieldName = {
  [Key in keyof RegistrationValues]: RegistrationValues[Key] extends string ? Key : never;
}[keyof RegistrationValues];
type CheckboxName = {
  [Key in keyof RegistrationValues]: RegistrationValues[Key] extends boolean ? Key : never;
}[keyof RegistrationValues];

type FieldBase = {
  label: string;
  required?: boolean;
  visibleWhen?: { name: CheckboxName; equals: boolean };
};

type InputField = FieldBase & {
  type: typeof REGISTRATION_FIELD_TYPE.PHONE | typeof REGISTRATION_FIELD_TYPE.TEXT;
  name: TextFieldName;
  placeholder: string;
  helper?: string;
  pattern?: string;
  inputProps?: Pick<
    TextInputProps,
    | 'maxLength'
    | 'keyboardType'
    | 'autoComplete'
    | 'textContentType'
    | 'autoCapitalize'
    | 'autoCorrect'
  >;
};

type CheckboxField = FieldBase & {
  type: typeof REGISTRATION_FIELD_TYPE.CHECKBOX;
  name: CheckboxName;
  segments?: readonly { text: string; highlighted: boolean }[];
};

export type RegistrationField = InputField | CheckboxField;
