'use server';

import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';

export const loginAction = async () => {
  const res = await api.auth.login();
  redirect(res.url);
};

export const logoutAction = async () => {
  await api.auth.logout();
  redirect('/');
};
