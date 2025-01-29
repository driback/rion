import type { User } from 'better-auth';
import type { StrictNonNullable } from '~/types';
import type { TCopyFileInput } from '../task.schema';

import { TRPCError } from '@trpc/server';
import { driveClient } from '~/configs/google-drive';
import { db } from '~/server/db/client';
import { task } from '~/server/db/schemas';
import { createSuccessResponse } from '../../shared.util';
import { extractFileId } from '../task.util';

const DRIVE_FILE_FIELDS =
  'id, name, mimeType, size, webViewLink, iconLink, thumbnailLink' as const;

export const copyFile = async (props: TCopyFileInput, user: User) => {
  const fileId = extractFileId(props.url);
  if (!fileId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Could not extract file ID from URL',
    });
  }

  try {
    const {
      data: copyData,
      status,
      statusText,
    } = await driveClient.files.copy({
      fileId,
      fields: DRIVE_FILE_FIELDS,
      requestBody: { parents: props.folderId ? [props.folderId] : [] },
    });

    if (status !== 200 || !copyData) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Failed to copy file: ${statusText}`,
      });
    }

    const data = copyData as StrictNonNullable<typeof copyData>;
    await db.insert(task).values({
      id: data.id,
      userId: user.id,
      name: data.name,
      mimeType: data.mimeType,
      size: +data.size,
      webViewLink: data.webViewLink,
      iconLink: data.iconLink,
      originalLink: props.url,
      type: 'file',
    });

    return createSuccessResponse(true as const);
  } catch (error) {
    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      cause: error,
    });
  }
};
