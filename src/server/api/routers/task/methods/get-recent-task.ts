import { eq } from 'drizzle-orm';
import { db } from '~/server/db/client';
import { task } from '~/server/db/schemas';
import { createPaginationResponse } from '../../shared.util';
import type { TGetRecentTaskInput } from '../task.schema';

export const getRecentTasks = async ({
  userId,
  page,
  limit,
}: TGetRecentTaskInput) => {
  try {
    const tasksPromise = db.query.task.findMany({
      where: (ts, { eq }) => eq(ts.userId, userId),
      orderBy: (ts, { desc }) => desc(ts.createdAt),
      columns: { createdAt: false, type: false, userId: false },
      limit: limit,
      offset: (page - 1) * limit,
    });
    const totalTasksPromise = await db.$count(task, eq(task.userId, userId));

    const [tasks, totalTasks] = await Promise.all([
      tasksPromise,
      totalTasksPromise,
    ]);

    return createPaginationResponse(
      tasks,
      {
        page,
        limit,
        totalPages: Math.ceil(totalTasks / limit),
        total: totalTasks,
      },
      null
    );
  } catch {
    return createPaginationResponse([], null, null);
  }
};
