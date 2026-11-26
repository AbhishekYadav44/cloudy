import express from 'express';
import { signupController, loginController } from '../controllers/userControllers.js';


const router = express.Router();

router.post('/register', signupController);
router.post('/login', loginController);

export default router; 