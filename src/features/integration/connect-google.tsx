'use client';

import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import GoogleIcon from '~/components/icons/googl-icon';
import { Button } from '~/components/ui/button';
import { connectGoogleAction } from '~/server/actions/api.action';

const ConnectGoogle = ({
  isConected,
  minimal,
}: { isConected?: boolean; minimal?: boolean }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      const { url } = await connectGoogleAction();
      router.push(url);
    });
  };

  if (minimal) {
    return (
      <button
        type="button"
        onClick={handleLogin}
        disabled={isPending || isConected}
        className="hover:underline"
      >
        Connect
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogin}
      disabled={isPending || isConected}
    >
      {isPending ? (
        <LoaderIcon className="size-3 animate-spin" />
      ) : (
        <GoogleIcon className="size-3" />
      )}
      {isConected ? 'Connected' : 'Connect'}
    </Button>
  );
};

export default ConnectGoogle;
