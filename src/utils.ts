export const unique = <T>(array: RA<T>): RA<T> => Array.from(new Set(array));
