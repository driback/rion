import type {
  TApiPaginationResponses,
  TApiSuccessResponses,
} from './shared.schema';

export const createSuccessResponse = <T>(data: T): TApiSuccessResponses<T> => ({
  data,
  error: null,
});

export const createPaginationResponse = <T>(
  data: T,
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  } | null,
  error: {
    message: string;
    code: string;
    details?: string[];
  } | null
): TApiPaginationResponses<T> => ({
  data,
  meta,
  error,
});
