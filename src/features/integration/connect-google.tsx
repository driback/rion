'use client';

import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import GoogleIcon from '~/components/icons/googl-icon';
import { Button } from '~/components/ui/button';
import {
  connectGoogleAction,
  disconnectGoogleAction,
} from '~/server/actions/api.action';

const ConnectGoogle = ({
  isConected,
  minimal,
}: { isConected?: boolean; minimal?: boolean }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleConnect = () => {
    startTransition(async () => {
      if (isConected) {
        await disconnectGoogleAction();
        router.refresh();
        return;
      }

      const { url } = await connectGoogleAction();
      router.push(url);
      return;
    });
  };

  if (minimal) {
    return (
      <button
        type="button"
        onClick={handleConnect}
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
      onClick={handleConnect}
      disabled={isPending}
    >
      {isPending ? (
        <LoaderIcon className="size-3 animate-spin" />
      ) : (
        <GoogleIcon className="size-3" />
      )}
      {isConected ? 'Disconnect' : 'Connect'}
    </Button>
  );
};

export default ConnectGoogle;
