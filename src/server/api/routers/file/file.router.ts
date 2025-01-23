import type { StrictNonNullable } from '~/app/types';

import { TRPCError } from '@trpc/server';
import { driveAuthClient } from '~/configs/google-drive';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { CopyInput, CopyOutput, type TCopyOutput } from './file.schema';
import { extractFileId } from './file.util';

export const fileRouter = createTRPCRouter({
  copy: protectedProcedure
    .input(CopyInput)
    .output(CopyOutput)
    .mutation(async ({ input }) => {
      const fileId = extractFileId(input.url);
      if (!fileId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Could not extract file ID from URL',
        });
      }

      try {
        const { data: copyData, status } = await driveAuthClient.files.copy({
          fileId,
          fields:
            'id, name, mimeType, size, webViewLink, iconLink, thumbnailLink',
        });

        if (status !== 200 || !copyData) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Failed to copy file: ${status}`,
          });
        }

        const data = copyData as StrictNonNullable<typeof copyData>;

        return {
          id: data.id,
          name: data.name,
          mimeType: data.mimeType,
          size: Number(data.size),
          webViewLink: data.webViewLink,
          iconLink: data.iconLink,
          thumbnailLink: data.thumbnailLink,
          originalLink: input.url,
        } satisfies TCopyOutput;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error,
        });
      }
    }),
});
