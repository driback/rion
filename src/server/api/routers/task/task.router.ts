import { z } from 'zod';
import {
  createTRPCRouter,
  integrationProcedure,
  protectedProcedure,
} from '../../trpc';
import { ApiPaginationResponses, ApiSuccessResponses } from '../shared.schema';
import { copyFile } from './methods/copy-file';
import { getRecentTasks } from './methods/get-recent-task';
import {
  CopyFileInput,
  GetRecentTaskInput,
  GetRecentTaskOutput,
} from './task.schema';

export const taskRouter = createTRPCRouter({
  copyFile: integrationProcedure
    .input(CopyFileInput)
    .output(ApiSuccessResponses(z.literal(true)))
    .mutation(({ input, ctx: { session } }) => copyFile(input, session.user)),
  getRecentTasks: protectedProcedure
    .input(GetRecentTaskInput)
    .output(ApiPaginationResponses(GetRecentTaskOutput.array()))
    .query(({ input }) => getRecentTasks(input)),
});
