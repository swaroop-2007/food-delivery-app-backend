import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyUserRequest } from '../middleware/validation';

const router = express.Router();

router.get('/', jwtParse, MyUserController.getCurrentUser);
router.post('/', MyUserController.createCurrentUser);
router.put(
    '/', 
    jwtParse, 
    validateMyUserRequest, 
    MyUserController.updateCurrentUser
);

export default router;