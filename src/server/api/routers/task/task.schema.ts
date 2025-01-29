import { z } from 'zod';
import { GOOGLE_DRIVE_REGEX } from './task.util';

export const CopyFileInput = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (val) => GOOGLE_DRIVE_REGEX.test(val),
      'Invalid Google Drive URL format.\n Example: https://drive.google.com/file/d/...'
    ),
  folderId: z.string().optional(),
});
export type TCopyFileInput = z.infer<typeof CopyFileInput>;

export const GetRecentTaskInput = z.object({
  userId: z.string(),
  page: z.number(),
  limit: z.number(),
});
export type TGetRecentTaskInput = z.infer<typeof GetRecentTaskInput>;

export const GetRecentTaskOutput = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  webViewLink: z.string(),
  iconLink: z.string(),
  originalLink: z.string(),
});
