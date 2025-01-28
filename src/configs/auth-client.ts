import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';
import { getBaseUrl } from '~/lib/utils';

const client = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [usernameClient()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
    },
  },
});

export const { signUp, signIn, signOut, updateUser } = client;
