import { z } from 'zod';

export const ApiSuccessResponses = <T>(schema: z.ZodType<T>) =>
  z.object({
    data: schema,
    error: z.null(),
  });

export type TApiSuccessResponses<T> = z.infer<
  ReturnType<typeof ApiSuccessResponses<T>>
>;

export const ApiPaginationResponses = <T>(schema: z.ZodType<T>) =>
  z.object({
    data: schema,
    meta: z
      .object({
        page: z.number(),
        totalPages: z.number(),
        total: z.number(),
        limit: z.number(),
      })
      .nullable(),
    error: z
      .object({
        message: z.string(),
        code: z.string(),
        details: z.string().array().optional(),
      })
      .nullable(),
  });
export type TApiPaginationResponses<T> = z.infer<
  ReturnType<typeof ApiPaginationResponses<T>>
>;
