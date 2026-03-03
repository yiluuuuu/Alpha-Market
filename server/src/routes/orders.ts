import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

const orderSchema = z.object({
    items: z.array(z.object({ productId: z.string(), quantity: z.number().int().positive() })).min(1),
    shippingName: z.string().min(1),
    shippingAddress: z.string().min(1),
    shippingCity: z.string().min(1),
    shippingPhone: z.string().min(1),
});

// GET /api/orders
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const where = req.user?.role === 'ADMIN' ? {} : { userId: req.user!.id };
        const orders = await prisma.order.findMany({
            where,
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: { select: { name: true, image: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ orders });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } },
            },
        });
        if (!order) { res.status(404).json({ message: 'Order not found' }); return; }
        if (req.user?.role !== 'ADMIN' && order.userId !== req.user!.id) {
            res.status(403).json({ message: 'Access denied' }); return;
        }
        res.json({ order });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/orders
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = orderSchema.parse(req.body);
        // Fetch products and validate stock
        const productIds = data.items.map(i => i.productId);
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

        let totalAmount = 0;
        const orderItems = data.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
            totalAmount += product.price * item.quantity;
            return { productId: item.productId, quantity: item.quantity, price: product.price };
        });

        const order = await prisma.$transaction(async (tx) => {
            // Deduct stock
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }
            return tx.order.create({
                data: {
                    userId: req.user!.id,
                    totalAmount,
                    shippingName: data.shippingName,
                    shippingAddress: data.shippingAddress,
                    shippingCity: data.shippingCity,
                    shippingPhone: data.shippingPhone,
                    items: { create: orderItems },
                },
                include: { items: { include: { product: true } } },
            });
        });

        res.status(201).json({ order });
    } catch (err: any) {
        if (err.name === 'ZodError') { res.status(400).json({ message: 'Validation failed', errors: err.errors }); return; }
        res.status(400).json({ message: err.message || 'Server error' });
    }
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const { status } = req.body;
        if (!validStatuses.includes(status)) { res.status(400).json({ message: 'Invalid status' }); return; }
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: { status },
            include: { user: { select: { name: true, email: true } }, items: true },
        });
        res.json({ order });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
