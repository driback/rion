import { drive, type drive_v3 } from '@googleapis/drive';
import { env } from '~/env';
import { oAuth2Client } from './google-auth';

declare global {
  var __driveAuthClient: drive_v3.Drive;
}

const initializeDriveClient = (auth: typeof oAuth2Client) => {
  try {
    return drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Drive client:', error);
    throw new Error('Google Drive client initialization failed');
  }
};

if (env.NODE_ENV === 'development') {
  global.__driveAuthClient = initializeDriveClient(oAuth2Client);
}

export const driveClient =
  global.__driveAuthClient ?? initializeDriveClient(oAuth2Client);
