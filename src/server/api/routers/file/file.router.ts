import { drive } from '@googleapis/drive';
import { TRPCError } from '@trpc/server';
import type { StrictNonNullable } from '~/app/types';
import { oAuth2Client } from '~/configs/google-auth';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { CopyInput, CopyOutput, type TCopyOutput } from './file.schema';
import { extractFileId } from './file.util';

export const fileRouter = createTRPCRouter({
  copy: protectedProcedure
    .input(CopyInput)
    .output(CopyOutput)
    .mutation(async ({ input }) => {
      try {
        const fileId = extractFileId(input.url);
        if (!fileId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Could not extract file ID from URL',
          });
        }

        const driveClient = drive('v3');

        const copyFile = await driveClient.files.copy({
          auth: oAuth2Client,
          fileId,
          fields:
            'id, name, mimeType, size, webViewLink, iconLink, thumbnailLink',
        });
        if (copyFile.status !== 200 || !copyFile.data) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Failed to copy file: ${copyFile.status}`,
          });
        }

        const data = copyFile.data as StrictNonNullable<typeof copyFile.data>;

        const output: TCopyOutput = {
          id: data.id,
          name: data.name,
          mimeType: data.mimeType,
          size: Number(data.size),
          webViewLink: data.webViewLink,
          iconLink: data.iconLink,
          thumbnailLink: data.thumbnailLink,
          originalLink: input.url,
        };

        return output;
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
