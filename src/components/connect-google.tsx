'use client';

import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { loginAction } from '~/server/actions/api.action';
import GoogleIcon from './icons/googl-icon';
import { Button } from './ui/button';

const ConnectGoogle = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      const { url } = await loginAction();
      router.push(url);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogin}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderIcon className="size-3 animate-spin" />
      ) : (
        <GoogleIcon className="size-3" />
      )}
      Connect
    </Button>
  );
};

export default ConnectGoogle;
