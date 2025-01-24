/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC } from '@trpc/server';
import type { Credentials } from 'google-auth-library';
import { cookies } from 'next/headers';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { oAuth2Client } from '~/configs/google-auth';
import { driveAuthClient } from '~/configs/google-drive';
import { COOKIE_NAME } from '~/lib/constants';
import { RedisClient } from '../redis/client';
import { RedisHashRepository } from '../redis/hash-repository';
import { KEYS } from '../redis/keys';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = (opts: {
  headers: Headers;
}) => {
  return {
    ...opts,
    driveAuthClient,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */

const authMiddleware = t.middleware(async ({ next }) => {
  try {
    const email = (await cookies()).get(COOKIE_NAME.GOOGlE_SUB)?.value;
    if (!email) {
      throw new Error('Google email not found in cookies');
    }

    const credentialsCache = new RedisHashRepository<Required<Credentials>>(
      KEYS.GOOGLE_CREDENTIALS(email),
      RedisClient
    );

    const tokens = await credentialsCache.getAll();
    if (!tokens) {
      throw new Error('Google credentials not found in cache');
    }

    oAuth2Client.setCredentials(tokens);
    return await next();
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
