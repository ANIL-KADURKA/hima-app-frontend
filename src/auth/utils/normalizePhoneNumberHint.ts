import { E164_PHONE_NUMBER_PATTERN } from '../constants/auth';

export function normalizePhoneNumberHint(
  hint: string,
  countryDialCode: string,
  nationalNumberLength: number,
): string | null {
  const trimmedHint = hint.trim();
  if (trimmedHint === '') return null;

  let digits = hint.replace(/\D/g, '');
  const countryCode = countryDialCode.replace(/\D/g, '');
  const countryCodeWithTrunkPrefix = `0${countryCode}`;

  const isInternational = trimmedHint.startsWith('+') || digits.startsWith('00');
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (isInternational) {
    if (
      digits.startsWith(`1${countryCode}`) &&
      digits.length === countryCode.length + nationalNumberLength + 1
    ) {
      digits = digits.slice(1);
    }

    if (digits.startsWith(countryCodeWithTrunkPrefix)) {
      digits = digits.slice(1);
    }

    if (!digits.startsWith(countryCode)) return null;

    if (
      digits.startsWith(countryCode) &&
      digits.length === countryCode.length + nationalNumberLength + 1 &&
      digits[countryCode.length] === '0'
    ) {
      digits = `${countryCode}${digits.slice(countryCode.length + 1)}`;
    }

    const nationalNumber = digits.slice(countryCode.length);
    const e164Number = `+${countryCode}${nationalNumber}`;
    return nationalNumber.length === nationalNumberLength &&
      E164_PHONE_NUMBER_PATTERN.test(e164Number)
      ? e164Number
      : null;
  }

  if (countryCode && digits.startsWith(countryCodeWithTrunkPrefix)) {
    digits = digits.slice(1);
  }
  if (countryCode && digits.startsWith(countryCode) && digits.length > nationalNumberLength) {
    const nationalNumber = digits.slice(countryCode.length);
    const normalizedNationalNumber =
      nationalNumber.length === nationalNumberLength + 1 && nationalNumber.startsWith('0')
        ? nationalNumber.slice(1)
        : nationalNumber;
    const e164Number = `+${countryCode}${normalizedNationalNumber}`;
    return E164_PHONE_NUMBER_PATTERN.test(e164Number) &&
      normalizedNationalNumber.length === nationalNumberLength
      ? e164Number
      : null;
  }

  if (digits.length === nationalNumberLength + 1 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  const e164Number = `+${countryCode}${digits}`;
  return countryCode !== '' &&
    digits.length === nationalNumberLength &&
    E164_PHONE_NUMBER_PATTERN.test(e164Number)
    ? e164Number
    : null;
}
