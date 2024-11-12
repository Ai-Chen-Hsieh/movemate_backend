import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authMiddleware from '@middlewares/auth.middleware';
import passport from 'passport';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signUp);

authRouter.post('/login', authController.logIn);

authRouter.post('/logout', authMiddleware, authController.logOut);

authRouter.get('/', (req, res) => {
  res.send(`
      <a href="http://localhost:3000/auth/google">Authenticate with Google</a>
      <br/>
      <a href="http://localhost:3000/auth/facebook">Authenticate with Facebook</a>
      `);
});

authRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

authRouter.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  }),
);

authRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/login',
    failureRedirect: '/',
  }),
  authController.facebookLogin,
);

authRouter.get('/login', (req, res) => {
  res.send(`login successfully`);
});

authRouter.get('/google/redirect', passport.authenticate('google'), authController.googleLogin);

authRouter.get('/protected', authMiddleware, authController.protected);

export default authRouter;
