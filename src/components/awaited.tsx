import { type ReactNode, Suspense } from 'react';
import { HydrateClient } from '~/trpc/server';

type AwaitedProps<T> = {
  promise: Promise<T>;
  children: (props: T) => ReactNode;
  loading?: ReactNode;
  error?: (error: Error) => ReactNode;
  resetKey?: string | number;
};

const PromiseComponent = async <T,>({
  promise,
  children,
}: Pick<AwaitedProps<T>, 'children' | 'promise'>) => {
  const res = await promise;
  return <HydrateClient>{children(res)}</HydrateClient>;
};

const Awaited = <T,>({
  promise,
  children,
  loading = null,
  error,
  resetKey,
}: AwaitedProps<T>) => {
  try {
    return (
      <Suspense fallback={loading} key={resetKey}>
        <PromiseComponent promise={promise}>{children}</PromiseComponent>
      </Suspense>
    );
  } catch (e) {
    if (error && e instanceof Error) {
      return error(e);
    }
    throw e;
  }
};

export default Awaited;
