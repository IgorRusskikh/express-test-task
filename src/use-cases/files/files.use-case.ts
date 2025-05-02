import { CreateFileDto, UpdateFileDto } from '@src/common/dtos/files.dto';
import {
  createOne,
  deleteOne,
  getAll,
  getOneById,
  getOneByNameExtensionType,
  updateOne,
} from '@src/services/files/files.service';

import { IFileRequest } from '@src/common/interfaces/file-request.interface';
import fs from 'fs';
import { getFileType } from '@src/common/util/getFileType.util';
import path from 'path';

export const getFiles = async (options?: {
  page?: number;
  listSize?: number;
  showPrivate?: boolean;
}) => {
  const { page = 1, listSize = 10, showPrivate = false } = options || {};

  const result = await getAll(showPrivate, page, listSize);

  return result;
};

export const getFile = async (id: string, userEmail: string) => {
  const file = await getOneById(id);

  if (!file) {
    return {
      success: false,
      code: 404,
      message: 'File not found',
    };
  }

  if (file.private && file.userEmail !== userEmail) {
    return {
      success: false,
      code: 403,
      message: 'Forbidden access to private file',
    };
  }

  return {
    success: true,
    message: 'File found',
    file,
  };
};

export const saveFile = async (
  file: Express.Multer.File,
  userEmail: string,
  req?: IFileRequest
) => {
  const fileType = getFileType(file);
  const mimeType = file.mimetype;

  let fileName;
  let extension;

  if (req?.fileInfo) {
    fileName = req.fileInfo.baseName;
    extension = req.fileInfo.extension;
  } else {
    extension = path.extname(file.originalname);
    fileName = `${path.basename(file.originalname, extension)}-${Date.now()}`;
  }

  const existingFile = await getOneByNameExtensionType(
    fileName,
    extension,
    mimeType
  );

  if (existingFile) {
    return {
      success: false,
      message: 'File already exists',
    };
  }

  const createFileDto: CreateFileDto = {
    name: fileName,
    extension,
    mimeType,
    type: fileType,
    size: file.size,
    userId: userEmail,
  };

  const newFile = await createOne(createFileDto);

  return {
    success: true,
    message: 'File uploaded successfully',
    file: newFile,
  };
};

export const updateFile = async (
  id: string,
  userEmail: string,
  updateFileDto: UpdateFileDto,
  newFileData?: Express.Multer.File
) => {
  const existingFile = await getOneById(id);

  if (!existingFile) {
    return {
      success: false,
      code: 404,
      message: 'File not found',
    };
  }

  if (existingFile.userEmail !== userEmail) {
    return {
      success: false,
      code: 403,
      message: 'Forbidden access to private file',
    };
  }

  const oldFilePath = path.join(
    process.cwd(),
    process.env.STORAGE_DIR || 'uploads',
    existingFile.name + existingFile.extension
  );

  if (newFileData) {
    const fileType = getFileType(newFileData);
    const mimeType = newFileData.mimetype;
    const extension = path.extname(newFileData.originalname);

    const fileName = updateFileDto.name || existingFile.name;

    const existingFileWithSameName = await getOneByNameExtensionType(
      fileName,
      extension,
      mimeType
    );

    if (existingFileWithSameName && existingFileWithSameName.id !== id) {
      return {
        success: false,
        code: 409,
        message: 'A file with the same name, extension and type already exists',
      };
    }

    updateFileDto = {
      ...updateFileDto,
      extension,
      mimeType,
      type: fileType,
      size: newFileData.size,
    };
  } else if (updateFileDto.name && updateFileDto.name !== existingFile.name) {
    const existingFileWithSameName = await getOneByNameExtensionType(
      updateFileDto.name,
      existingFile.extension,
      existingFile.mimeType
    );

    if (existingFileWithSameName && existingFileWithSameName.id !== id) {
      return {
        success: false,
        code: 409,
        message: 'A file with the same name, extension and type already exists',
      };
    }
  }

  try {
    const updatedFile = await updateOne(id, updateFileDto);

    const newFilePath = path.join(
      process.cwd(),
      process.env.STORAGE_DIR || 'uploads',
      updatedFile.name + updatedFile.extension
    );

    if (newFileData) {
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      if (newFileData.buffer) {
        fs.writeFileSync(newFilePath, newFileData.buffer);
      } else if (newFileData.path && fs.existsSync(newFileData.path)) {
        fs.copyFileSync(newFileData.path, newFilePath);
      }
    } else if (oldFilePath !== newFilePath && fs.existsSync(oldFilePath)) {
      fs.renameSync(oldFilePath, newFilePath);
    }

    return {
      success: true,
      code: 200,
      message: 'File updated successfully',
      file: updatedFile,
    };
  } catch (error) {
    return {
      success: false,
      code: 500,
      message: 'Error updating file: ' + (error as Error).message,
    };
  }
};

export const deleteFile = async (id: string, userEmail: string) => {
  const file = await getOneById(id);

  if (!file) {
    return {
      success: false,
      code: 404,
      message: 'File not found',
    };
  }

  if (file.userEmail !== userEmail) {
    return {
      success: false,
      code: 403,
      message: 'Forbidden access to private file',
    };
  }

  const deletedFile = await deleteOne(id);

  const filePath = path.join(
    process.cwd(),
    process.env.STORAGE_DIR || 'uploads',
    deletedFile.name + deletedFile.extension
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return {
    success: true,
    code: 200,
    message: 'File deleted successfully',
  };
};
