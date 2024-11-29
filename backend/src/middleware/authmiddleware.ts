import type {Request,Response,NextFunction} from "express";
import jwt from 'jsonwebtoken';

export const SecureRoutes = (req: Request,res: Response,next: NextFunction) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    console.log("Token",token);

    if (!token) {
         res.status(401).json({ error: 'Unauthorized User' });
         return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decoded);
        req.user = decoded; 
        next(); 
    } catch (error) {
         res.status(403).json({ error: 'Forbidden, invalid token' });
         return;
    }
}
