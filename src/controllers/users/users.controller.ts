import { Request, Response } from 'express';
import { getAll, getOneByEmail } from '@src/services/users';

export const profile = async (req: Request, res: Response) => {
  const user = req.user;

  console.log(user);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};
