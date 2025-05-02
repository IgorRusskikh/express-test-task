import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET_KEY as string;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN as '10m';
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN as '7d';

console.log('jwtSecret', jwtSecret);

export const generateAccessToken = (payload: any) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: accessTokenExpiresIn,
  });

  return token;
};

export const generateRefreshToken = (payload: any) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, jwtSecret);

  return decoded;
};
