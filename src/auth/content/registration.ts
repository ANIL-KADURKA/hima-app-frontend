import { brandContent } from '@/shared/content/common';

export const registrationContent = {
  title: 'Get Started',
  subtitle: 'Enter your mobile number to continue',
  phoneLabel: 'Mobile number',
  phonePlaceholder: 'Enter mobile number',
  phoneHelper: 'You will receive an OTP on this number.',
  referralToggle: 'Have a referral code?',
  referralLabel: 'Referral code',
  referralPlaceholder: 'Enter referral code',
  consentLabel: 'Accept terms and conditions, community guidelines and moderation policy',
  consent: [
    { text: 'I accept ', highlighted: false },
    { text: 'terms & conditions', highlighted: true },
    { text: ', and ', highlighted: false },
    { text: 'community guidelines & moderation policy', highlighted: true },
    { text: ` of ${brandContent.name}.`, highlighted: false },
  ],
  submit: 'Send OTP',
  notice:
    'By proceeding, your phone number will be verified by Truecaller and you thereby accept to the Terms of Service.',
  dismissNotice: 'Dismiss Truecaller notice',
} as const;
