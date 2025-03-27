import { z } from 'zod';

export const signupSchema = z.object({
    phone: z.string().min(10).max(15).regex(/^\d+$/, 'Phone number must contain only digits'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').optional(),
    photo: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const phoneSchema = z.object({
    phone: z.string().min(10).max(15),
});

export const verifyOTPSchema = phoneSchema.extend({
    otp: z.string().length(6),
});

export const loginSchema = phoneSchema.extend({
    password: z.string().min(1, "Password is required"),
});