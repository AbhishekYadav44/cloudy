import express from 'express';
import { sendOtpController, verifyOtp } from '../controllers/otpController.js';


const router = express.Router();

router.post('/send-otp', (req, res, next) => {
    console.log("Send OTP route reached");
    next();
}, sendOtpController);
router.post('/verify-otp', verifyOtp);

export default router;