import { IFileRequest } from './../common/interfaces/file-request.interface';
import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(
  process.cwd(),
  process.env.STORAGE_DIR || 'uploads'
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const disallowedExtensions = ['.exe', '.bat', '.sh', '.php', '.js', '.sql'];
const maxFileSize =
  parseInt(process.env.MAX_FILE_SIZE as string) * 1024 * 1024 ||
  10 * 1024 * 1024;

export const generateFileName = (file: Express.Multer.File) => {
  const extension = path.extname(file.originalname);
  const filename = path.basename(file.originalname, extension);
  const timestamp = Date.now();

  return {
    fullName: `${filename}-${timestamp}${extension}`,
    baseName: `${filename}-${timestamp}`,
    extension,
  };
};

const diskStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename(req: IFileRequest, file, callback) {
    const fileInfo = generateFileName(file);
    req.fileInfo = fileInfo;

    return callback(null, fileInfo.fullName);
  },
});

const memoryStorage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (disallowedExtensions.includes(path.extname(file.originalname))) {
    return callback(new Error('Invalid file extension'));
  }

  callback(null, true);
};

export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

export const updateUpload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});
