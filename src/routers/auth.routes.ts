import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authMiddleware from '@middlewares/auth.middleware';
import passport from "passport";

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signUp);

authRouter.post('/login', authController.logIn);

authRouter.post('/logout', authMiddleware, authController.logOut);

authRouter.get('/', (req, res) => {
    res.send('<a href="http://localhost:3000/auth/google">Authenticate with Google</a>');
});

authRouter.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

authRouter.get("/google/redirect", passport.authenticate("google"), authController.googleLogin);

authRouter.get('/protected', authMiddleware, authController.protected);


export default authRouter;