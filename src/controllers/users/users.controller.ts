import { Request, Response } from 'express';

export const profile = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};
