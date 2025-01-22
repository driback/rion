'use client';

import { useTransition } from 'react';
import { loginAction } from '~/server/actions/api.action';

const ConnectGoogle = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      await loginAction();
    });
  };

  return (
    <div className="inline-flex text-sm">
      <p className="inline-block text-center">
        You need to connect your google drive.
      </p>
      <button
        className="ml-2 flex items-center gap-2 hover:underline"
        type="button"
        onClick={handleLogin}
      >
        {isPending ? 'Connecting...' : 'Connect'}
      </button>
    </div>
  );
};

export default ConnectGoogle;
