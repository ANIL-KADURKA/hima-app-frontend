export function editOtp(value: string, index: number, input: string, length: number) {
  const digits = input.replace(/\D/g, '');
  const position = Math.min(Math.max(index, 0), value.length, length - 1);

  // OS autofill and a full-code paste replace the complete code from any cell.
  if (digits.length >= length) {
    return { value: digits.slice(0, length), focusIndex: length - 1 };
  }
  if (!digits) {
    // Ignore non-numeric keystrokes; an empty input is a deliberate deletion.
    if (input) return { value, focusIndex: position };
    return {
      value: value.slice(0, position) + value.slice(position + 1),
      focusIndex: Math.max(0, position - 1),
    };
  }
  return {
    value: (value.slice(0, position) + digits + value.slice(position + digits.length)).slice(
      0,
      length,
    ),
    focusIndex: Math.min(position + digits.length, length - 1),
  };
}
