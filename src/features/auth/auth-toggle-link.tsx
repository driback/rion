import Link from 'next/link';
import { cn } from '~/lib/utils';

interface AuthToggleLinkProps {
  mode: 'sign-in' | 'sign-up';
  className?: string;
}

const AuthToggleLink = ({ mode, className = '' }: AuthToggleLinkProps) => {
  const content = {
    'sign-in': {
      text: "Don't have an account?",
      linkText: 'Sign Up Now',
      href: '/account/sign-up',
    },
    'sign-up': {
      text: 'Have an account??',
      linkText: 'Sign In Now',
      href: '/account/sign-in',
    },
  };

  const { text, linkText, href } = content[mode];

  return (
    <div className={cn('text-center text-sm', className)}>
      {text}{' '}
      <Link href={href} className="underline underline-offset-4">
        {linkText}
      </Link>
    </div>
  );
};

export default AuthToggleLink;
