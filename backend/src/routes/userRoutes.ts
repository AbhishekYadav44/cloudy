import express from 'express';
import { signupController, loginController } from '../controllers/userControllers';


const router = express.Router();

router.post('/register', signupController);
router.post('/login', loginController);

export default router;