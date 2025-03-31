import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET_USER = process.env.JWT_SECRET_USER || 'your-secret-key';
const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'your-secret-key';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_USER) as { userId: number; phone: string };
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ','');

    if(!token){
        res.status(401).json({message:"No token,Authorization denied"});
        return;
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET_ADMIN) as {
            adminId: number, phone: string
        };
        (req as any).admin = decoded;
        next();
    }
    catch(error){
        res.status(401).json({message:"Invalid token"});
    }
}