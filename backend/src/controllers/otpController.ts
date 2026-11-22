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