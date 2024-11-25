import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const generateToken = (payload:User) => {
  const { password, ...userPayload } = payload;
  const secretKey = process.env.JWT_SECRET; // Replace with your own secret key
  const options = {
    expiresIn: '1h', // Token expiration time
  };

  const token = jwt.sign(userPayload, secretKey, options);
  return token;
};

export default generateToken;