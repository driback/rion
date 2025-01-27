const FILE_ID_REGEX = /\/folders\/([a-zA-Z0-9_-]+)/;

export const extractFolderId = (url: string): string | null => {
  const match = url.match(FILE_ID_REGEX);
  return match ? match[1] : null;
};
