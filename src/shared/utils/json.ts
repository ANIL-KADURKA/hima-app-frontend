export type JsonValue = JsonObject | JsonValue[] | string | number | boolean | null;
export type JsonObject = { readonly [key: string]: JsonValue };

export function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseJson(text: string): JsonValue {
  return JSON.parse(text) as JsonValue;
}
