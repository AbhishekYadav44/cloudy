
import type { Request, Response } from "express";
import { db } from "../prisma/db.js";
import bcrypt from 'bcrypt';

export async function signupController(req: Request, res: Response) {

    const { name, email, username, password, otp } = req.body;
    if (!name || !email || !username || !password || !otp) {
        return res.json({
            message: "all feilds are required"
        })
    }

    const verifyOtp = await db.orm.public.Otp.where({ email , verified : true }).first();
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
            message : "user succesfully registered!"
        })

    } catch (e) {
        return res.json({
            e,
            message: " error while signup!"
        })
    }


}
export async function loginController(req: Request, res: Response) {

    console.log('login cotroller')

}