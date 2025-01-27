import { z } from 'zod';

export const UpdateUserAvatarInput = z.object({
  username: z.string(),
  imageUrl: z.string().url(),
});
