import * as argon2 from 'argon2';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  SESSION_ID_COOKIE_NAME,
  SESSION_ID_COOKIE_OPTIONS,
} from '@src/common/constants/cookies.constant';
import { Request, Response } from 'express';
import {
  create as createUser,
  getOneByEmail as getUserByEmail,
} from '@src/services/users/users.service';
import {
  revokeAllTokens,
  verifyToken,
} from '@src/use-cases/tokens/tokens.use-case';

import { User } from '@src/common/types/user';
import { create as createRefreshToken } from '@src/services/tokens/tokens.service';
import { generateAccessToken } from '@src/common/util/tokens.util';

export const login = async (req: Request, res: Response): Promise<void> => {
  const accessToken = generateAccessToken({
    email: (req.user as User).email,
  });

  const [_, sessionId] = await createRefreshToken({
    email: (req.user as User).email,
  });

  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );
  res.cookie(SESSION_ID_COOKIE_NAME, sessionId, SESSION_ID_COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  try {
    const passwordHash = await argon2.hash(password);

    const newUser = await createUser({
      email,
      password: passwordHash,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { valid, userData } = await verifyToken(
    req.cookies[SESSION_ID_COOKIE_NAME]
  );

  if (!valid || !userData) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const accessToken = generateAccessToken({
    email: userData.email,
  });

  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS
  );

  res.status(200).json({
    success: true,
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  await revokeAllTokens((req.user as User).email);

  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.status(200).json({ message: 'Logged out successfully' });
};
