import type { RegistrationField, RegistrationValues } from '../types/registration';

export function isFieldVisible(field: RegistrationField, values: RegistrationValues) {
  return !field.visibleWhen || values[field.visibleWhen.name] === field.visibleWhen.equals;
}

export function isRegistrationValid(
  fields: readonly RegistrationField[],
  values: RegistrationValues,
) {
  return fields.every((field) => {
    if (!isFieldVisible(field, values)) return true;
    if (field.type === 'checkbox') return !field.required || values[field.name];
    const value = values[field.name].trim();
    if (!value) return !field.required;
    return !field.pattern || new RegExp(field.pattern).test(value);
  });
}
