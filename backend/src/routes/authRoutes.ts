import express from 'express';
import { signupController, loginController } from '../controllers/userControllers';
import { sendOtpController } from '../controllers/otpController';


const router = express.Router();

router.post('/send-otp', sendOtpController);
// router.post('/verify-otp', verifyOtpController);

export default router;