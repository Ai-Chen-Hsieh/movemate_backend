import { Router } from 'express';
import UsersController from 'controllers/users.controller';
import authMiddleware from '@middlewares/auth.middleware';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/users', usersController.getUsers);

usersRouter.get('/users/:id', usersController.getUserById);

usersRouter.put('/users/:id', authMiddleware, usersController.updateUser);

usersRouter.delete('/users/:id', authMiddleware, usersController.deleteUser);

export default usersRouter;