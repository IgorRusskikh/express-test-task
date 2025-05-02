import * as crypto from 'crypto';

import { Prisma } from '@prisma/client';
import { generateRefreshToken } from '@src/common/util/tokens.util';
import prisma from '@src/common/util/prisma.util';

export const getOneByEmail = async (email: string) => {
  const token = await prisma.refreshToken.findFirst({
    where: {
      user: {
        email,
      },
    },
  });

  return token;
};

export const getOneBySessionId = async (
  sessionId: string,
  include: Prisma.RefreshTokenInclude
) => {
  const token = await prisma.refreshToken.findUnique({
    where: {
      sessionId,
    },
    include,
  });

  return token;
};

export const create = async (payload: { email: string }) => {
  const refreshToken = generateRefreshToken(payload);
  const sessionId = crypto.randomUUID();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      sessionId,
      user: {
        connect: {
          email: payload.email,
        },
      },
      expiresAt: new Date(
        Date.now() +
          parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS as string)
      ),
    },
  });

  return [refreshToken, sessionId];
};

export const remove = async (token: string) => {
  await prisma.refreshToken.delete({
    where: {
      token,
    },
  });
};

export const updateOne = async (
  token: string,
  data: Prisma.RefreshTokenUpdateInput
) => {
  await prisma.refreshToken.update({
    where: {
      token,
    },
    data,
  });
};

export const updateMany = async (
  where: Prisma.RefreshTokenWhereInput,
  data: Prisma.RefreshTokenUpdateInput
) => {
  await prisma.refreshToken.updateMany({
    where,
    data,
  });
};
