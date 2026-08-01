/**
 * Converts a TypeScript enum into an array of key/value objects.
 *
 * Works with:
 * - Numeric enums
 * - String enums
 *
 * @returns An array of objects in the following format:
 * ```ts
 * [
 *   { key: 'GOLD', id: 0 },
 *   { key: 'SILVER', id: 1 }
 * ]
 * ```
 * or for string enums:
 * ```ts
 * [
 *   { key: 'K24', id: '24K' },
 *   { key: 'K22', id: '22K' }
 * ]
 * ```
 */

export interface enumToArrayModel {
  key: string;
  id: number | string;
}
export function enumToArray<T extends Record<string, string | number>>(enumObj: T) {
  return Object.entries(enumObj)
    .filter(([key]) => isNaN(Number(key))) // Removes reverse mapping for numeric enums
    .map(([key, value]) => ({
      key,
      id: value,
    }));
}
