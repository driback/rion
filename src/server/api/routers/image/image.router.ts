import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { imagekit } from '~/configs/imagekit';
import { db } from '~/server/db/client';
import { user } from '~/server/db/schemas';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { UpdateUserAvatarInput } from './image.schema';

export const imageRouter = createTRPCRouter({
  updateAvatar: publicProcedure
    .input(UpdateUserAvatarInput)
    .mutation(async ({ input }) => {
      const findUser = await db.query.user.findFirst({
        where: (us, { eq }) => eq(us.username, input.username),
      });
      if (!findUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const getImage = await fetch(input.imageUrl);
      const buffer = await getImage.arrayBuffer();

      const uploadImage = await imagekit.upload({
        file: Buffer.from(buffer),
        fileName: `${input.username}.png`,
        folder: `${input.username}/avatar`,
      });

      const updateAvatar = await db
        .update(user)
        .set({ image: uploadImage.url })
        .where(eq(user.username, input.username))
        .returning();

      if (!updateAvatar.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to update avatar',
        });
      }

      return { success: true };
    }),
});
