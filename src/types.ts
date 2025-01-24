export type StrictNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};
