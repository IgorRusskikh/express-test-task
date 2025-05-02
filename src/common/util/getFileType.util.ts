import { FileType } from '@prisma/client';

export const getFileType = (file: Express.Multer.File) => {
  if (file.mimetype.startsWith('image/')) {
    return FileType.IMAGE;
  }

  if (file.mimetype.startsWith('video/')) {
    return FileType.VIDEO;
  }

  if (file.mimetype.startsWith('audio/')) {
    return FileType.AUDIO;
  }

  if (file.mimetype.startsWith('application/')) {
    return FileType.DOCUMENT;
  }

  return FileType.OTHER;
};
