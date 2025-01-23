'use client';

import { LoaderIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { logoutAction } from '~/server/actions/api.action';
import { useRecentTaskStore } from './providers/recent-task-provider';
import { Button } from './ui/button';

const DisconnectGoogle = () => {
  const router = useRouter();
  const reset = useRecentTaskStore((s) => s.reset);

  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      reset();
      router.push('/');
    });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="size-8 bg-red-500/20 text-red-500"
      onClick={handleLogout}
      title="log-out"
    >
      {isPending ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : (
        <LogOutIcon className="size-4" />
      )}
    </Button>
  );
};

export default DisconnectGoogle;
