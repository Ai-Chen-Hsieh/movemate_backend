import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import authMiddleware from '@middlewares/auth.middleware';
import passport from 'passport';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', 
  /* 	#swagger.tags = ['Auth']
        #swagger.description = '註冊會員(手動)' */
  authController.signUp);

authRouter.post('/login', 
  /* 	#swagger.tags = ['Auth']
        #swagger.description = '會員登入(手動)' */
  authController.logIn);

authRouter.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send(`
      <a href="http://localhost:3000/auth/google">Authenticate with Google</a>
      <br/>
      <a href="http://localhost:3000/auth/facebook">Authenticate with Facebook</a>
      `);
});

authRouter.get(
  '/auth/google',
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'google第三方登入' */
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

authRouter.get(
  '/auth/facebook',
  /* 	#swagger.tags = ['Auth']
        #swagger.description = 'facebook第三方登入' */
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  }),
);

authRouter.get(
  '/auth/facebook/callback',
  // #swagger.ignore = true
  passport.authenticate('facebook', {
    successRedirect: '/login',
    failureRedirect: '/',
  }),
  authController.facebookLogin,
);

authRouter.get('/login', (req, res) => {
  // #swagger.ignore = true
  res.send(`login successfully`);
});

authRouter.get('/google/redirect', 
  // #swagger.ignore = true
  passport.authenticate('google'), authController.googleLogin);


export default authRouter;
