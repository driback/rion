import type { drive_v3 } from '@googleapis/drive';
import type { StrictNonNullable } from '~/types';

export const copyFolder = async (
  drive: drive_v3.Drive,
  folderId: string,
  parentFolderId: string | null = null
) => {
  const folderInfo = await drive.files.get({
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

  const list = await drive.files.list({
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
