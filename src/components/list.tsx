import type { ReactNode } from 'react';

type ListProps<T extends unknown[]> = {
  children: (props: T[0], index: number) => ReactNode;
  of: T;
};

const List = <T extends unknown[]>({ children, of }: ListProps<T>) => {
  return <>{of.map((props, index) => children(props, index))}</>;
};

export default List;
