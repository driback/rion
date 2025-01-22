import { drive } from '@googleapis/drive';
import { TRPCError } from '@trpc/server';
import { oAuth2Client } from '~/configs/google-auth';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { CopySchema } from './file.schema';
import { extractFileId } from './file.util';

export const fileRouter = createTRPCRouter({
  copy: protectedProcedure.input(CopySchema).mutation(async ({ input }) => {
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
        fields: 'id, name, mimeType, size, webViewLink, iconLink',
      });
      if (copyFile.status !== 200 || !copyFile.data) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Failed to copy file: ${copyFile.status}`,
        });
      }

      return copyFile.data;
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
