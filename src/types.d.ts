declare type RA<T> = readonly T[];

declare type IR<V> = Readonly<Record<string, V>>;

declare type ItemOf<ARRAY extends RA<unknown>> = ARRAY[number];

declare type WritableArray<T> = T[];
