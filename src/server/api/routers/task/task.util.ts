const FILE_ID_REGEX = /\/file\/d\/([^/]+)/;

export const GOOGLE_DRIVE_REGEX =
  /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(?:\/.*)?$/;

export const extractFileId = (url: string): string | null => {
  const match = url.match(FILE_ID_REGEX);
  return match ? match[1] : null;
};
