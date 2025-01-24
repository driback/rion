import type { drive_v3 } from '@googleapis/drive';
import type { Credentials } from 'google-auth-library';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { oAuth2Client } from '~/configs/google-auth';
import { driveAuthClient } from '~/configs/google-drive';
import { COOKIE_NAME } from '~/lib/constants';
import { RedisClient } from '~/server/redis/client';
import { RedisHashRepository } from '~/server/redis/hash-repository';
import { KEYS } from '~/server/redis/keys';
import type { StrictNonNullable } from '~/types';

const folderId = '1uezC-7GDa36Q7-FwEDLJafQllyT9sIOa';

const copyFolder = async (
  drive: drive_v3.Drive,
  folderId: string,
  parentFolderId: string | null = null
) => {
  const folderInfo = await driveAuthClient.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType',
  });

  if (!folderInfo.data.id) return null;

  const createFolder = await drive.files.create({
    fields: 'id, name, mimeType',
    requestBody: {
      mimeType: 'application/vnd.google-apps.folder',
      name: folderInfo.data.name,
      parents: parentFolderId ? [parentFolderId] : [],
    },
  });
  if (!createFolder.data.id) return null;

  const list = await driveAuthClient.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, size, parents)',
  });

  if (!list.data.files) return null;

  for (const file of list.data.files) {
    const data = file as StrictNonNullable<typeof file>;

    if (data.mimeType === 'application/vnd.google-apps.folder') {
      await copyFolder(drive, data.id, createFolder.data.id);
    } else {
      await drive.files.copy({
        fileId: data.id ?? '',
        fields: 'id, name, mimeType',
        requestBody: { parents: [createFolder.data.id] },
      });
    }
  }
};

export const GET = async () => {
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

  await copyFolder(driveAuthClient, folderId);

  return NextResponse.json({ data: 1 });
};
