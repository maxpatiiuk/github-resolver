// eslint-disable-next-line @typescript-eslint/naming-convention
declare type RA<T> = readonly T[];

declare type IR<V> = Readonly<Record<string, V>>;

declare type ItemOf<ARRAY extends RA<unknown>> = ARRAY[number];

// eslint-disable-next-line functional/prefer-readonly-type
declare type WritableArray<T> = T[];
