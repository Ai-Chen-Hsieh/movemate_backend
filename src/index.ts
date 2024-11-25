import session from 'express-session'; 
import passport from 'passport';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import validateEnv from './utils/validateEnv';
import usersRouter from './routers/users.routes';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.routes';
import errorMiddleware from './middlewares/error.middleware';
import "./config/passport";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger-output.json';


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
// Use session middleware with a secret
app.use(session({
  secret: process.env.SECRET_KEY, // Replace with a secure key
  resave: false, // Avoid resaving session if nothing has changed
  saveUninitialized: false, // Only save sessions when initialized
  cookie: { secure: false }, // Set to `true` if using HTTPS
}));

// Initialize Passport and use session management
app.use(passport.initialize());
app.use(passport.session()); // Enable session support for Passport
// Routes

app.use('/', usersRouter);
app.use('/', authRouter);
app.use(errorMiddleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Server Activation

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  