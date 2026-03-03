import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Multer setup
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    category: z.string().min(1),
    stock: z.coerce.number().int().min(0),
    image: z.string().optional(),
});

// GET /api/products
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { search, category, sortBy, order } = req.query as Record<string, string>;
        const where: any = {};
        if (search) where.name = { contains: search, mode: 'insensitive' };
        if (category) where.category = { equals: category, mode: 'insensitive' };

        const orderBy: any = {};
        if (sortBy === 'price') orderBy.price = order === 'desc' ? 'desc' : 'asc';
        else orderBy.createdAt = 'desc';

        const products = await prisma.product.findMany({ where, orderBy });
        res.json({ products });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const product = await prisma.product.findUnique({ where: { id: req.params.id } });
        if (!product) { res.status(404).json({ message: 'Product not found' }); return; }
        res.json({ product });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/products (admin)
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');
        const data = productSchema.parse({ ...req.body, image: imageUrl });
        const product = await prisma.product.create({ data: { ...data, image: imageUrl } });
        res.status(201).json({ product });
    } catch (err: any) {
        if (err.name === 'ZodError') { res.status(400).json({ message: 'Validation failed', errors: err.errors }); return; }
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/products/:id (admin)
router.put('/:id', authenticate, requireAdmin, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
        if (!existing) { res.status(404).json({ message: 'Product not found' }); return; }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.image || existing.image);
        const data = productSchema.parse({ ...req.body, image: imageUrl });
        const product = await prisma.product.update({ where: { id: req.params.id }, data: { ...data, image: imageUrl } });
        res.json({ product });
    } catch (err: any) {
        if (err.name === 'ZodError') { res.status(400).json({ message: 'Validation failed', errors: err.errors }); return; }
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ message: 'Product deleted' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
