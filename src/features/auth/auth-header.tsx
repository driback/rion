import Link from 'next/link';
import { cn } from '~/lib/utils';

type AuthHeaderProps = {
  title: string;
  description: string;
  className?: string;
};

const AuthHeader = ({ title, description, className }: AuthHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Link href="/" className="mb-4 w-fit hover:underline">
        Rion
      </Link>
      <h1 className="font-semibold text-3xl">{title}</h1>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default AuthHeader;
