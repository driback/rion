import { db } from '~/server/db/client';
import { createTRPCRouter, protectedProcedure } from '../../trpc';

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    const integration = await db.query.integrationToUser.findFirst({
      where: (ur, { eq }) => eq(ur.userId, session.user.id),
    });
    return { ...session, integration };
  }),
});
