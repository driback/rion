import { drive, type drive_v3 } from '@googleapis/drive';
import { env } from '~/env';
import { oAuth2Client } from './google-auth';

declare global {
  var __driveAuthClient: drive_v3.Drive | undefined;
}

const initializeDriveClient = (auth: typeof oAuth2Client): drive_v3.Drive => {
  try {
    return drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Drive client:', error);
    throw new Error('Google Drive client initialization failed');
  }
};

if (env.NODE_ENV === 'development') {
  global.__driveAuthClient =
    global.__driveAuthClient ?? initializeDriveClient(oAuth2Client);
}

export const driveAuthClient: drive_v3.Drive =
  global.__driveAuthClient ?? initializeDriveClient(oAuth2Client);
