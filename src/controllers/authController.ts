import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateQRCode } from '../utils/qrCodeUtils';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otpUtils';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const requestOTP = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        const otp = generateOTP();

        //send OTP via SMS
        console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({
            message: 'OTP sent successfully',
            otp // should remove this after sms
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

export const signup = async (req: Request, res: Response) => {
    const { phone, name, email, photo, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const qrCode = await generateQRCode(phone);

        const user = await prisma.user.create({
            data: { phone, name, email, photo, password: hashedPassword, qrCode },
        });

        const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({ message: 'User created', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

export const login = async (req: Request, res: Response) : Promise<void>=> {
    try {
        const { phone, password } = req.body;

        const user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};