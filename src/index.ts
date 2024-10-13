import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import validateEnv from './utils/validateEnv';
import usersRouter from './routers/users.routes';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.routes';
import errorMiddleware from './middlewares/error.middleware';


// App Variables

dotenv.config();
validateEnv();

const port = process.env.PORT;

// App Configuration
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes

app.use('/', usersRouter);
app.use('/', authRouter);
app.use(errorMiddleware);

// Server Activation

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  