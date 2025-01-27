import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

type FieldConformProps = {
  errors?: string | string[];
  children: ReactNode;
  className?: string;
};

const FieldConform = ({ errors, children, className }: FieldConformProps) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {children}
      {errors && <p className="text-[.8rem] text-red-500">{errors}</p>}
    </div>
  );
};

export default FieldConform;
