import { Request, Response } from 'express';
import {
  deleteFile as deleteFileUseCase,
  getFile as getFileUseCase,
  getFiles as getFilesList,
  saveFile as saveFileUseCase,
  updateFile as updateFileUseCase,
} from './../../use-cases/files/files.use-case';

import { UpdateFileDto } from '@src/common/dtos/files.dto';
import { User } from '@src/common/types/user';
import path from 'path';

export const uploadFile = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const result = await saveFileUseCase(file, (req.user as User).email, req);

  if (result.success) {
    res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    res.status(400).json({ message: result.message });
  }
};

export const getFiles = async (req: Request, res: Response) => {
  let listSize = 10;
  let page = 1;

  if (req.query.list_size) {
    const parsedSize = parseInt(req.query.list_size as string);
    if (!isNaN(parsedSize) && parsedSize > 0) {
      listSize = parsedSize;
    }
  }

  if (req.query.page) {
    const parsedPage = parseInt(req.query.page as string);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  const result = await getFilesList({ listSize, page });

  res.status(200).json(result);
};

export const getFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await getFileUseCase(id, (req.user as User).email);

  if (!file.success) {
    res.status(file.code ?? 500).json({ message: file.message });
    return;
  }

  res.status(200).json({ file: file.file });
};

export const downloadFile = async (req: Request, res: Response) => {
  const { id } = req.params;

  const file = await getFileUseCase(id, (req.user as User).email);

  if (!file.success) {
    res.status(file.code ?? 500).json({ message: file.message });
    return;
  }

  const filePath = path.join(
    process.cwd(),
    process.env.STORAGE_DIR || 'uploads',
    file.file!.name + file.file!.extension
  );

  res.download(filePath);
};

export const updateFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, private: isPrivate } = req.body;
  const userEmail = (req.user as User).email;

  const updateData: UpdateFileDto = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (isPrivate !== undefined) {
    updateData.private = isPrivate;
  }

  const result = await updateFileUseCase(id, userEmail, updateData, req.file);

  if (!result.success) {
    res.status(result.code || 400).json({ message: result.message });
    return;
  }

  res.status(result.code || 200).json({ message: result.message });
};

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userEmail = (req.user as User).email;

  const result = await deleteFileUseCase(id, userEmail);

  if (!result.success) {
    res.status(result.code).json({ message: result.message });
    return;
  }

  res.status(result.code).json({ message: result.message });
};
