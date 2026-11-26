
import type { NextFunction, Request, Response } from "express";
import { db } from "../prisma/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const jwt_secret = process.env.JWT_SECRET!
export async function signupController(req: Request, res: Response) {

    const { name, email, username, password, otp } = req.body;
    if (!name || !email || !username || !password || !otp) {
        return res.json({
            message: "all feilds are required"
        })
    }

    const verifyOtp = await db.orm.public.Otp.where({ email, verified: true }).first();
    if (!verifyOtp) {
        return res.json({
            message: "otp is not valid!"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await db.orm.public.User.create({

            name,
            email,
            password: hashedPassword,
            username
        })

        const rootFolder = await db.orm.public.Folder.create({
            name: `root${email}`,
            userId: user.id,
            parentFolderId: null

        })

        await db.orm.public.User.where({ id: user.id }).update({
            rootFolderId: rootFolder.id
        })


        await db.orm.public.Otp.where({ email }).delete();

        return res.json({
            message: "user succesfully registered!"
        })

    } catch (e) {
        return res.json({
            e,
            message: " error while signup!"
        })
    }


}

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required!"
            });
        }

        const user = await db.orm.public.User.where({ email }).first();

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register first."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password!"
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            jwt_secret,
            { expiresIn: "15m" }
        );

        return res.status(200).json({
            message: "User logged in successfully!",
            token
        });

    } catch (e) {
        next(e);
    }
}