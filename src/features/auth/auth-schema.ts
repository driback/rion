import { z } from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;

export const SignUpFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((val) => PASSWORD_REGEX.test(val)),
});

export const SignInFormSchema = SignUpFormSchema.pick({ email: true }).extend({
  password: z.string(),
  rememberMe: z.boolean().default(false),
});
