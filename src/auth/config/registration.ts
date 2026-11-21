import { registrationContent as content } from '@/auth/content/registration';
import type { RegistrationField, RegistrationValues } from '@/auth/types/registration';

export const initialRegistrationValues: RegistrationValues = {
  phone: '',
  hasReferral: false,
  referralCode: '',
  accepted: true,
};

// JSON-compatible field definitions. Rendering and validation use the same schema.
export const registrationFields = [
  {
    type: 'phone',
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
  { type: 'checkbox', name: 'hasReferral', label: content.referralToggle },
  {
    type: 'text',
    name: 'referralCode',
    label: content.referralLabel,
    placeholder: content.referralPlaceholder,
    visibleWhen: { name: 'hasReferral', equals: true },
    inputProps: { autoCapitalize: 'characters', autoCorrect: false },
  },
  {
    type: 'checkbox',
    name: 'accepted',
    label: content.consentLabel,
    required: true,
    segments: content.consent,
  },
] as const satisfies readonly RegistrationField[];
