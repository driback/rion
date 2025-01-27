'use client';

import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '~/components/ui/button';
import { signOut } from '~/configs/auth-client';

const SignOut = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSignOut = () =>
    startTransition(() => {
      signOut({ fetchOptions: { onSuccess: router.refresh } });
    });

  return (
    <Button
      variant="ghost"
      type="button"
      className="h-auto w-full justify-start px-2 py-1.5"
      disabled={isPending}
      onClick={handleSignOut}
    >
      <LogOutIcon className="size-4" />
      Log out
    </Button>
  );
};

export default SignOut;
