'use client';

import { LoaderIcon, LogOutIcon } from 'lucide-react';
import { useTransition } from 'react';
import { logoutAction } from '~/server/actions/api.action';
import { Button } from './ui/button';

const Logout = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="bg-red-500/20 text-red-500"
      title="log-out"
      onMouseDown={handleLogout}
    >
      {isPending ? (
        <LoaderIcon className="size-4 animate-spin" />
      ) : (
        <LogOutIcon className="size-4" />
      )}
    </Button>
  );
};

export default Logout;
