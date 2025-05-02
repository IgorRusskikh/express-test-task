import {
  getOneBySessionId,
  updateMany,
} from '@src/services/tokens/tokens.service';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyToken = async (
  sessionId: string
): Promise<{ valid: boolean; userData?: { email: string } }> => {
  const token = await getOneBySessionId(sessionId, {
    user: {
      select: {
        email: true,
      },
    },
  });

  if (
    !token ||
    token.isActive === false ||
    token.expiresAt < new Date() ||
    !token.user ||
    !token.user.email
  ) {
    return { valid: false };
  }

  const userData = {
    email: token.user.email,
  };

  return {
    valid: true,
    userData,
  };
};

export const revokeAllTokens = async (email: string) => {
  await updateMany(
    {
      user: {
        email,
      },
    },
    {
      isActive: false,
    }
  );

  return true;
};
