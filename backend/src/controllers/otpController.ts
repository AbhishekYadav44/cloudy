import nodeMailer from 'nodemailer';
import type { Request, Response } from 'express';
import { sendOtp } from '../utils/sendOtp';
import { db } from '../prisma/db';

export async function sendOtpController(req: Request, res: Response) {

    const { email } = req.body;

    const existingUser = await db.orm.public.User.where({ email })
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

    const otpdata = await db.orm.public.Otp.where(email).first() // first returns 1st entry of query like 1st otp 

    if (!otpdata) {
        return res.json({
            message: "invalid otp!"
        })
    }

    return res.json({
        message : "otp verified"
    })
}