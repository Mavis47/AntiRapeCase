import type { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res: Response,userId: number) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    })

    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //csrf
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
}