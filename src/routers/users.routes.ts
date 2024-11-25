import { Router } from 'express';
import UsersController from 'controllers/users.controller';
import authMiddleware from '@middlewares/auth.middleware';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/users', 
     /* 	#swagger.tags = ['User']
        #swagger.description = '取得所有使用者' */
    authMiddleware, usersController.getUsers);

usersRouter.get('/users/:id', 
    /* 	#swagger.tags = ['User']
        #swagger.description = '取得單一使用者' */
    authMiddleware, usersController.getUserById);

usersRouter.put('/users/:id', 
    /* 	#swagger.tags = ['User']
        #swagger.description = '更改單一使用者資訊' */
    authMiddleware, usersController.updateUser);

usersRouter.delete('/users/:id', 
    /* 	#swagger.tags = ['User']
        #swagger.description = '刪除單一使用者' */
    authMiddleware, usersController.deleteUser);

export default usersRouter;