'use server';

import { api } from '~/trpc/server';

export const loginAction = api.auth.login;
export const logoutAction = api.auth.logout;
