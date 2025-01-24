import { TRPCError } from '@trpc/server';
import type { StrictNonNullable } from '~/types';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import {
  GetFolderInput,
  GetFolderOutput,
  type TGetFolderOutput,
} from './folder.schema';

export const folderRouter = createTRPCRouter({
  get: protectedProcedure
    .input(GetFolderInput)
    .output(GetFolderOutput)
    .mutation(async ({ ctx: { driveAuthClient }, input }) => {
      const folder = input?.folderId ?? 'root';

      try {
        const {
          status,
          statusText,
          data: getFolders,
        } = await driveAuthClient.files.list({
          q: `'${folder}' in parents and mimeType='application/vnd.google-apps.folder' and trashed = false`,
          fields: 'files(id, name)',
        });

        if (status !== 200) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Failed to get folders: ${statusText}`,
          });
        }

        if (!getFolders.files?.length) {
          return { data: [] };
        }

        const data: TGetFolderOutput['data'] = getFolders.files.map((file) => {
          const { id, name } = file as StrictNonNullable<typeof file>;
          return { id, name };
        });

        return { data } as TGetFolderOutput;
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
