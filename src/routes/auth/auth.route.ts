import { NextFunction, Request, Response, Router } from 'express';
import {
  login,
  logout,
  register,
  updateAccessToken,
} from '@src/controllers/auth/auth.controller';

import { User } from '@src/common/types/user';
import passport from 'passport';

const router = Router();

router.post(
  '/signin',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'local',
      { session: false },
      (err: any, user: User) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res
            .status(404)
            .json({ message: `User with email ${req.body.email} not found` });
        }

        req.login(user, { session: false }, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }

          return login(req, res);
        });
      }
    )(req, res, next);
  },
  login
);
router.post('/signin/new_token', updateAccessToken);
router.post('/signup', register);
router.get('/logout', logout);

export default router;
