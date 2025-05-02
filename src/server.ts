import localStrategy, {
  deserializeUser,
  serializeUser,
} from './common/strategies/local.strategy';

import authRouter from './routes/auth/auth.route';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import express from 'express';
import filesRouter from './routes/files/files.route';
import { jwtGuard } from './common/guards/jwt.guard';
import passport from 'passport';
import usersRouter from './routes/users/users.route';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use(jwtGuard);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);

passport.use(localStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use(errorHandler);

export default app;
