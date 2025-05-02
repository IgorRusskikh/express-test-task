import { CreateFileDto, UpdateFileDto } from '../../common/dtos/files.dto';

import prisma from '@src/common/util/prisma.util';

export const getAll = async (
  showPrivate: boolean = false,
  page: number = 1,
  listSize: number = 10
) => {
  const skip = (page - 1) * listSize;

  const files = await prisma.file.findMany({
    where: {
      private: showPrivate
        ? undefined
        : {
            not: true,
          },
    },
    skip,
    take: listSize,
  });

  const totalFiles = await prisma.file.count({
    where: {
      private: showPrivate
        ? undefined
        : {
            not: true,
          },
    },
  });

  const totalPages = Math.ceil(totalFiles / listSize);

  return {
    files,
    pagination: {
      totalFiles,
      totalPages,
      currentPage: page,
      listSize,
    },
  };
};

export const getOneById = async (id: string) => {
  const file = await prisma.file.findUnique({
    where: { id },
  });

  if (!file) {
    return null;
  }

  return file;
};

export const getOneByNameExtensionType = async (
  name: string,
  extension: string,
  mimeType: string
) => {
  const file = await prisma.file.findUnique({
    where: {
      name_extension_mimeType: {
        name,
        extension,
        mimeType,
      },
    },
  });

  if (!file) {
    return null;
  }

  return file;
};

export const createOne = async (createFileDto: CreateFileDto) => {
  const newFile = await prisma.file.create({
    data: {
      name: createFileDto.name,
      extension: createFileDto.extension,
      type: createFileDto.type,
      size: createFileDto.size,
      mimeType: createFileDto.mimeType,
      user: {
        connect: {
          email: createFileDto.userId,
        },
      },
    },
  });

  return newFile;
};

export const updateOne = async (id: string, updateFileDto: UpdateFileDto) => {
  const updatedFile = await prisma.file.update({
    where: { id },
    data: updateFileDto,
  });

  return updatedFile;
};

export const deleteOne = async (id: string) => {
  const deletedFile = await prisma.file.delete({
    where: { id },
  });

  return deletedFile;
};
