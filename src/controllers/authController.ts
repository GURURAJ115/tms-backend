import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateQRCode } from '../utils/qrCodeUtils';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
    const { phone, name, email, photo, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const qrCode = await generateQRCode(phone);

        const user = await prisma.user.create({
            data: { phone, name, email, photo, password: hashedPassword, qrCode },
        });

        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
