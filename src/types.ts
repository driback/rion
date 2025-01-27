import type { ReactNode } from 'react';

export type StrictNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export type LayoutProps<T = object> = {
  params: Promise<T>;
  children?: ReactNode;
};

export type PageProps<T = object, TS extends string = ''> = {
  params: Promise<T>;
  searchParams: Promise<Record<TS, string | undefined>>;
};
