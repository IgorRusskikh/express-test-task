import { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const SESSION_ID_COOKIE_NAME = 'sessionId';

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  domain: process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost',
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE as string),
};

export const SESSION_ID_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  domain: process.env.NODE_ENV === 'production' ? '.example.com' : 'localhost',
  sameSite: 'none',
  secure: process.env.NODE_ENV === 'production',
  maxAge: parseInt(process.env.SESSION_ID_MAX_AGE as string),
};
