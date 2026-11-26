import nodeMailer from 'nodemailer';
import type { Request, Response } from 'express';
import { randomInt } from 'node:crypto';
import bcrypt from 'bcrypt';
import { db } from '../prisma/db.js';
import nodemailer from 'nodemailer';

export async function sendOtp(email: string) {
    const otp = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(otp, 10);

    try {
        await db.orm.public.Otp.create({
            email,
            otpHash: hashedOtp,
            expiresAt
        })

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.USER_PASS
            }

        })

        const html = `
  <div style="font-family: Arial, sans-serif;">
    <h2>Cloudy Email Verification</h2>
    <p>Your OTP is:</p>
    <h1 style="color:#2563eb;">${otp}</h1>
    <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
  </div>
`;

        try {
            const info = await transporter.sendMail({
                from: `"Cloudy" <${process.env.USER}>`,
                to: email,
                subject: "Verify your Email ",
                html
            });

            console.log("Message sent: %s", info.messageId);
            return { success: true, message: `otp sent succesfully to ${email}` }
        } catch (err) {
            console.error("Error while sending mail:", err);
            return {
                success: false,
                message: "Failed to send OTP",
            };
        }

    } catch (e) {
        console.log(e)
    }
}