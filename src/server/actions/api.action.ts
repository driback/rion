'use server';

import { api } from '~/trpc/server';

export const connectGoogleAction = api.integration.google.connect;
export const disconnectGoogleAction = api.integration.google.disconnect;
