import { CreateUserDto, UpdateUserDto } from '../../common/dtos/users.dto';

import prisma from '@src/common/util/prisma.util';

export const getAll = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const getOneByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
};

export const create = async (createUserDto: CreateUserDto) => {
  const user = await prisma.user.create({
    data: { email: createUserDto.email, password: createUserDto.password },
  });
  return user;
};

export const update = async (email: string, updateUserDto: UpdateUserDto) => {
  const user = await prisma.user.update({
    where: { email },
    data: updateUserDto,
  });
  return user;
};

export const remove = async (email: string) => {
  const user = await prisma.user.delete({
    where: { email },
  });
  return user;
};
