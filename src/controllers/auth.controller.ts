import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { validate } from 'class-validator';
import generateToken from '@/utils/jwtUtils';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDto = new CreateUserDto();
      createUserDto.email = req.body.email;
      createUserDto.name = req.body.name;
      createUserDto.password = req.body.password;

      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        const constraints = {};
        errors.forEach(error => {
          const propertyName = error.property;
          const errorConstraints = Object.values(error.constraints);
          constraints[propertyName] = errorConstraints;
        });
        res.status(400).json({ constraints });
        return;
      }
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      // Generate a JWT
      const token = generateToken(signUpUserData);

      // Respond with the token and user data
      res.status(201).json({ token, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { findUser } = await this.authService.login(userData);

      // Generate a JWT
      const token = generateToken(findUser);
      res.status(200).json({ token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user.id;
      const { findUser } = await this.authService.googleLogin(userId);
      // Generate a JWT
      const token = generateToken(findUser);
      res.status(200).json({ token, message: 'google login' });
    } catch (error) {
      next(error);
    }
  };

  public facebookLogin = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.user.id;
      const { findUser } = await this.authService.facebookLogin(userId);
      // Generate a JWT
      const token = generateToken(findUser);
      res.status(200).json({ token, message: 'facebook login' });
    } catch (error) {
      console.log(error);
    }
  };
}

export default AuthController;
