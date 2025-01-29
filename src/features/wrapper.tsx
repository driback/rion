import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

export const AppWrapper = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'relative mx-auto flex min-h-[100dvh] w-dvw max-w-screen-xl flex-col overflow-clip px-px',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const PageHeader = ({
  className,
  children,
  ...props
}: ComponentProps<'header'>) => {
  return (
    <header
      className={cn('flex w-full items-center justify-between py-4', className)}
      {...props}
    >
      {children}
    </header>
  );
};

export const PageMain = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>) => {
  return (
    <main
      className={cn('relative flex w-full flex-col gap-8', className)}
      {...props}
    >
      {children}
    </main>
  );
};

export const Container = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
      {children}
    </div>
  );
};
