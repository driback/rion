import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { COOKIE_CONFIG } from '~/configs/cookie';
import { oAuth2Client } from '~/configs/google-auth';
import { COOKIE_NAME } from '~/lib/constants';
import { db } from '~/server/db/client';
import { integrationToUser } from '~/server/db/schemas';
import { RedisClient } from '~/server/redis/client';
import { KEYS } from '~/server/redis/keys';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../trpc';

export const integrationRouter = createTRPCRouter({
  google: {
    connect: publicProcedure.mutation(async () => {
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
    disconnect: protectedProcedure.mutation(async ({ ctx: { session } }) => {
      const userId = session.user.id;
      await Promise.all([
        db
          .delete(integrationToUser)
          .where(eq(integrationToUser.userId, userId)),
        RedisClient.del(KEYS.GOOGLE_CREDENTIALS(userId)),
      ]);
    }),
  },
});
