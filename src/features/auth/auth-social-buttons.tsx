'use client';

import { useCallback, useTransition } from 'react';
import GoogleIcon from '~/components/icons/googl-icon';
import { Button } from '~/components/ui/button';
import { signIn } from '~/configs/auth-client';

const AuthSocialButtons = () => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = useCallback(() => {
    startTransition(() => {
      signIn.social({
        provider: 'google',
        callbackURL: '/',
        newUserCallbackURL: '/account/me',
      });
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        disabled={isPending}
        onClick={handleGoogleSignIn}
      >
        <GoogleIcon className="size-4" />
        Continue with Google
      </Button>
    </div>
  );
};

export default AuthSocialButtons;
