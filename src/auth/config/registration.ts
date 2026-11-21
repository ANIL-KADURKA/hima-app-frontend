import { registrationContent as content } from '@/auth/content/registration';
import type { RegistrationField, RegistrationValues } from '@/auth/types/registration';

export const REGISTRATION_FIELD_TYPE = {
  PHONE: 'phone',
  TEXT: 'text',
  CHECKBOX: 'checkbox',
} as const;

export const initialRegistrationValues: RegistrationValues = {
  phone: '',
  hasReferral: false,
  referralCode: '',
  accepted: true,
};

// JSON-compatible field definitions. Rendering and validation use the same schema.
export const registrationFields = [
  {
    type: REGISTRATION_FIELD_TYPE.PHONE,
    name: 'phone',
    label: content.phoneLabel,
    placeholder: content.phonePlaceholder,
    helper: content.phoneHelper,
    required: true,
    pattern: '^\\d{10}$',
    inputProps: {
      keyboardType: 'phone-pad',
      autoComplete: 'tel-national',
      textContentType: 'telephoneNumber',
      maxLength: 10,
    },
  },
  { type: REGISTRATION_FIELD_TYPE.CHECKBOX, name: 'hasReferral', label: content.referralToggle },
  {
    type: REGISTRATION_FIELD_TYPE.TEXT,
    name: 'referralCode',
    label: content.referralLabel,
    placeholder: content.referralPlaceholder,
    visibleWhen: { name: 'hasReferral', equals: true },
    inputProps: { autoCapitalize: 'characters', autoCorrect: false },
  },
  {
    type: REGISTRATION_FIELD_TYPE.CHECKBOX,
    name: 'accepted',
    label: content.consentLabel,
    required: true,
    segments: content.consent,
  },
] as const satisfies readonly RegistrationField[];
