import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { COOKIE_CONFIG } from '~/configs/cookie';
import { oAuth2Client } from '~/configs/google-auth';
import { COOKIE_NAME } from '~/lib/constants';
import { RedisClient } from '~/server/redis/client';
import { KEYS } from '~/server/redis/keys';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc';

export const authRouter = createTRPCRouter({
  login: publicProcedure.mutation(async () => {
    const state = crypto.randomBytes(32).toString('hex');

    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive', 'openid'],
      state,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME.GOOGLE_OAUTH_STATE, state, {
      ...COOKIE_CONFIG,
      maxAge: 60 * 10,
    });
    return { url };
  }),
  logout: protectedProcedure.mutation(async () => {
    const cookie = await cookies();

    const email = cookie.get(COOKIE_NAME.GOOGlE_SUB)?.value;
    if (!email) {
      throw new Error('Google email not found in cookies');
    }

    void RedisClient.del(KEYS.GOOGLE_CREDENTIALS(email));

    cookie.delete(COOKIE_NAME.GOOGlE_SUB);
  }),
});
