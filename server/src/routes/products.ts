import { Router, Response } from 'express';
import cloudinary from '../config/cloudinary';
import upload from '../middleware/upload';
import fs from 'fs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Validation schema
const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number().positive(),
    category: z.string().min(1),
    stock: z.coerce.number().int().min(0),
    image: z.string().optional(),
});


// ✅ GET all products
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { search, category, sortBy, order, minPrice, maxPrice, page, limit } = req.query as Record<string, string>;

        const where: any = {};

        if (search) where.name = { contains: search, mode: 'insensitive' };
        if (category) where.category = { equals: category, mode: 'insensitive' };

        // price filter
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const orderBy: any = {};
        if (sortBy === 'price') orderBy.price = order === 'desc' ? 'desc' : 'asc';
        else orderBy.createdAt = 'desc';

        // pagination
        const p = parseInt(page) || 1;
        const l = parseInt(limit) || 50;
        const skip = (p - 1) * l;

        const [products, total] = await Promise.all([
            prisma.product.findMany({ where, orderBy, skip, take: l }),
            prisma.product.count({ where }),
        ]);

        res.json({
            products,
            pagination: {
                total,
                page: p,
                limit: l,
                pages: Math.ceil(total / l),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ✅ GET single product
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
        });

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// ✅ CREATE product (admin)
router.post(
    '/',
    authenticate,
    requireAdmin,
    upload.single('image'),
    async (req: any, res: Response): Promise<void> => {
        try {
            let imageUrl = '';

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'products',
                });

                imageUrl = result.secure_url;

                // delete temp file
                fs.unlinkSync(req.file.path);
            }

            const data = productSchema.parse({
                ...req.body,
                image: imageUrl,
            });

            const product = await prisma.product.create({
                data: {
                    ...data,
                    image: imageUrl,
                },
            });

            res.status(201).json({ product });
        } catch (err: any) {
            console.error(err);
            if (err.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: err.errors });
                return;
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
);


// ✅ UPDATE product (admin)
router.put(
    '/:id',
    authenticate,
    requireAdmin,
    upload.single('image'),
    async (req: any, res: Response): Promise<void> => {
        try {
            const existing = await prisma.product.findUnique({
                where: { id: req.params.id },
            });

            if (!existing) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            let imageUrl = existing.image;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'products',
                });

                imageUrl = result.secure_url;

                fs.unlinkSync(req.file.path);
            }

            const data = productSchema.parse({
                ...req.body,
                image: imageUrl,
            });

            const updatedProduct = await prisma.product.update({
                where: { id: req.params.id },
                data: {
                    ...data,
                    image: imageUrl,
                },
            });

            res.json({ product: updatedProduct });
        } catch (err: any) {
            console.error(err);
            if (err.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: err.errors });
                return;
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
);


// ✅ DELETE product (admin)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.product.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;