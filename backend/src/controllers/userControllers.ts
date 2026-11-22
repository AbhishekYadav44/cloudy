
import type { Request,Response } from "express";

export async function signupController(req: Request, res: Response) {

    const { name, email, username, password ,  otp } = req.body;
    if (!name || !email || !username || !password) {
         return res.json({
            message : "all feilds are required"
         })
    }




}
export async function loginController(req: Request, res: Response) {

    console.log('login cotroller')

}