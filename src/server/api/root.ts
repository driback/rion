import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { authRouter } from './routers/auth/auth.router';
import { fileRouter } from './routers/file/file.router';
import { folderRouter } from './routers/folder/folder.router';
import { imageRouter } from './routers/image/image.router';
import { integrationRouter } from './routers/integration/integration.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  integration: integrationRouter,
  file: fileRouter,
  folder: folderRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
