import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/dashboard/stats (admin)
// Accepts ?period=daily|weekly|monthly
router.get('/stats', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const period = (req.query.period as string) || 'daily';
        const days = period === 'monthly' ? 30 : period === 'weekly' ? 7 : 7;

        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - days);
        periodStart.setHours(0, 0, 0, 0);

        const [totalProducts, totalOrders, revenueResult, recentOrders, lowStockProducts, ordersByStatus] = await Promise.all([
            prisma.product.count(),
            prisma.order.count({ where: { createdAt: { gte: periodStart } } }),
            prisma.order.aggregate({ _sum: { totalAmount: true }, where: { createdAt: { gte: periodStart } } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } }, items: true },
            }),
            prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: 'asc' } }),
            prisma.order.groupBy({ by: ['status'], _count: true }),
        ]);

        // Sales chart grouped by day
        const totalRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } });
        const salesChart = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            const result = await prisma.order.aggregate({
                where: { createdAt: { gte: start, lte: end } },
                _sum: { totalAmount: true },
                _count: true,
            });
            salesChart.push({
                date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: result._sum.totalAmount || 0,
                orders: result._count,
            });
        }

        res.json({
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            periodRevenue: revenueResult._sum.totalAmount || 0,
            recentOrders,
            lowStockProducts,
            ordersByStatus,
            salesChart,
            period,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/dashboard/inventory (admin)
router.get('/inventory', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { stock: 'asc' },
            select: { id: true, name: true, category: true, stock: true, price: true },
        });
        res.json({ products });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
