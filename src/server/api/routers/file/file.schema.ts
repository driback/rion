import { z } from 'zod';
import { GOOGLE_DRIVE_REGEX } from './file.util';

export const CopyInput = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (val) => GOOGLE_DRIVE_REGEX.test(val),
      'Invalid Google Drive URL format.\n Example: https://drive.google.com/file/d/...'
    ),
  folderId: z.string().optional(),
});

export const CopyOutput = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  webViewLink: z.string(),
  iconLink: z.string(),
  thumbnailLink: z.string().optional(),
  originalLink: z.string(),
});
export type TCopyOutput = z.infer<typeof CopyOutput>;
