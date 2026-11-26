import type { Request, Response } from 'express';
import { sendOtp } from '../utils/sendOtp.js';
import { db } from '../prisma/db.js';
import bcrypt from 'bcrypt'

export async function sendOtpController(req: Request, res: Response) {
   
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    const existingUser = await db.orm.public.User.where({ email }).first()
    if (existingUser) {
        return res.json({
            message: "user already exists!"
        })
    }

    const data = await sendOtp(email);

    res.json({
        message: 'otp sent',
        data
    })

}

export async function verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
    }

    const otpdata = await db.orm.public.Otp.where({ email }).first() // first returns 1st entry of query like 1st otp 

    if (!otpdata) {
        return res.json({
            message: "invalid otp!"
        })
    }

    if (new Date() > otpdata.expiresAt) {
        return res.status(400).json({
            message: "OTP expired. Please request a new OTP."
        });
    }

    const verifyotp = await bcrypt.compare(otp, otpdata.otpHash)
    if (!verifyotp) {
        return res.json({
            message: "otp is not valid try again!"
        })
    }
    await db.orm.public.Otp.where({ email }).update({
        verified: true
    })

    return res.json({
        message: "otp verified"
    })
}