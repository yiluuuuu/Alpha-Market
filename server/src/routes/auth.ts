import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = registerSchema.parse(req.body);
        const exists = await prisma.user.findUnique({ where: { email: data.email } });
        if (exists) { res.status(400).json({ message: 'Email already registered' }); return; }
        const hashed = await bcrypt.hash(data.password, 12);
        const user = await prisma.user.create({
            data: { name: data.name, email: data.email, password: hashed },
        });
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
        );
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
        if (err.name === 'ZodError') { res.status(400).json({ message: 'Validation failed', errors: err.errors }); return; }
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) { res.status(401).json({ message: 'Invalid credentials' }); return; }
        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) { res.status(401).json({ message: 'Invalid credentials' }); return; }
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
        );
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err: any) {
        if (err.name === 'ZodError') { res.status(400).json({ message: 'Validation failed', errors: err.errors }); return; }
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        if (!user) { res.status(404).json({ message: 'User not found' }); return; }
        res.json({ user });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
