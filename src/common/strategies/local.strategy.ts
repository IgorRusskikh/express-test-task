import * as argon2 from 'argon2';

import { Strategy as LocalStrategy } from 'passport-local';
import { getOneByEmail as getUserByEmail } from '@src/services/users/users.service';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: true,
  },
  verify
);

async function verify(email: string, password: string, cb: any) {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return cb(null, false, { message: 'User not found' });
  }

  try {
    const isPasswordValid = await argon2.verify(
      existingUser.password,
      password
    );

    if (!isPasswordValid) {
      return cb(null, false, { message: 'Invalid password' });
    }

    const dataToReturn = {
      email: existingUser.email,
    };

    return cb(null, dataToReturn);
  } catch (err) {
    console.log(err);
    return cb(null, false, { message: 'Invalid password' });
  }
}

export const serializeUser = (user: any, cb: any) => {
  process.nextTick(function () {
    cb(null, { email: user.email });
  });
};

export const deserializeUser = async (user: any, cb: any) => {
  process.nextTick(function () {
    return cb(null, user);
  });
};

export default localStrategy;
