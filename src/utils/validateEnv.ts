import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DATABASE_URL: str(),
    SECRET_KEY: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
