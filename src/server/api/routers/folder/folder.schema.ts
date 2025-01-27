import { z } from 'zod';

const FolderSchema = z.object({ id: z.string(), name: z.string() });
export type TFolderSchema = z.infer<typeof FolderSchema>;

export const GetFolderInput = z
  .object({
    folderId: z.string(),
  })
  .optional();
export const GetFolderOutput = z.object({ data: FolderSchema.array() });
export type TGetFolderOutput = z.infer<typeof GetFolderOutput>;

export const CopyFolderInput = z.object({
  folderUrl: z.string().url(),
  parentFolderId: z.string().optional(),
});
