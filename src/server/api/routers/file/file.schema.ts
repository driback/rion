import { z } from 'zod';
import { GOOGLE_DRIVE_REGEX } from './file.util';

export const CopySchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (val) => GOOGLE_DRIVE_REGEX.test(val),
      'Invalid Google Drive URL format'
    ),
});
