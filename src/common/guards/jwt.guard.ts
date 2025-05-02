import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../util/tokens.util';

const excludedPaths = ['/auth/signin', '/auth/signin/*', '/auth/signup'];

export const jwtGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    excludedPaths.some((path) => {
      const regex = new RegExp('^' + path.replace('*', '.*') + '$');
      return regex.test(req.path);
    })
  ) {
    return next();
  }

  const token = req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
