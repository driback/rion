import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

const AuthWrapper = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div
      className={cn('my-auto flex h-fit w-[20rem] flex-col gap-6', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default AuthWrapper;
