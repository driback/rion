import { TRPCError } from '@trpc/server';
import type { StrictNonNullable } from '~/types';
import { createTRPCRouter, integrationProcedure } from '../../trpc';
import {
  CopyFolderInput,
  GetFolderInput,
  GetFolderOutput,
  type TGetFolderOutput,
} from './folder.schema';
import { extractFolderId } from './folder.util';
import { copyFolder } from './methods/copy-folder';

export const folderRouter = createTRPCRouter({
  get: integrationProcedure
    .input(GetFolderInput)
    .output(GetFolderOutput)
    .mutation(async ({ ctx: { driveClient }, input }) => {
      const folder = input?.folderId ?? 'root';

      try {
        const {
          status,
          statusText,
          data: getFolders,
        } = await driveClient.files.list({
          q: `'${folder}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
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
  copy: integrationProcedure
    .input(CopyFolderInput)
    .mutation(async ({ ctx: { driveClient }, input }) => {
      const folderId = extractFolderId(input.folderUrl);
      if (!folderId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }
      return await copyFolder(driveClient, folderId, input.parentFolderId);
    }),
});
