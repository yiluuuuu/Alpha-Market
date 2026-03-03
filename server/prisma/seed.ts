import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Users
    const adminPass = await bcrypt.hash('password123', 12);
    const customerPass = await bcrypt.hash('password123', 12);

    const admin = await prisma.user.upsert({
        where: { email: 'yilkalbewketu8@gmail.com' },
        update: {},
        create: {
            name: 'Yilkal Admin',
            email: 'yilkalbewketu8@gmail.com',
            password: adminPass,
            role: 'ADMIN',
        },
    });

    const customer = await prisma.user.upsert({
        where: { email: 'yilkalbewuketu@gmail.com' },
        update: {},
        create: {
            name: 'Yilkal Customer',
            email: 'yilkalbewuketu@gmail.com',
            password: customerPass,
            role: 'CUSTOMER',
        },
    });

    console.log(`✅ Admin: ${admin.email}`);
    console.log(`✅ Customer: ${customer.email}`);

    // Products
    const products = [
        {
            name: 'Apple-style Wireless EarPods',
            description: 'Premium wireless earbuds with crystal-clear sound, touch controls, and up to 6 hours battery life. Compatible with all Bluetooth devices.',
            price: 1299,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
            category: 'EarPods',
            stock: 50,
        },
        {
            name: 'Noise Cancelling EarPods',
            description: 'Advanced active noise cancellation technology blocks out distractions. Deep bass, clear highs, and a comfortable in-ear fit.',
            price: 1899,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
            category: 'EarPods',
            stock: 35,
        },
        {
            name: 'Smart Digital Watch',
            description: 'Track your fitness goals with this smart digital watch. Features heart rate monitoring, step counter, sleep tracking, and smartphone notifications.',
            price: 2499,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            category: 'Watches',
            stock: 25,
        },
        {
            name: 'Classic Analog Watch',
            description: 'Timeless elegance meets modern precision. Stainless steel case, sapphire crystal glass, and genuine leather strap. Water resistant up to 50m.',
            price: 3999,
            image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
            category: 'Watches',
            stock: 15,
        },
        {
            name: 'Casio Scientific Calculator',
            description: 'The Casio FX-82MS scientific calculator with 240 functions. Ideal for students and professionals. Solar powered with battery backup.',
            price: 649,
            image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500',
            category: 'Scientific Calculators',
            stock: 80,
        },
        {
            name: 'FX-991ES Plus Calculator',
            description: 'Advanced non-programmable scientific calculator with 417 functions, natural textbook display, and matrix/vector calculations.',
            price: 1199,
            image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500',
            category: 'Scientific Calculators',
            stock: 60,
        },
        {
            name: 'Used Dell Desktop PC',
            description: 'Refurbished Dell OptiPlex desktop with Intel Core i5, 8GB RAM, 256GB SSD, Windows 10 Pro. Perfect for office and home use. Tested and certified.',
            price: 12999,
            image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
            category: 'Used PCs',
            stock: 8,
        },
        {
            name: 'Used HP Laptop',
            description: 'Certified refurbished HP ProBook 14" laptop with Intel Core i5, 8GB RAM, 256GB SSD, Windows 11. Great battery life, ideal for work and study.',
            price: 18999,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
            category: 'Used PCs',
            stock: 5,
        },
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { id: p.name as any },
            update: p,
            create: p,
        });
    }

    // Use createMany with skipDuplicates instead
    await prisma.product.deleteMany({});
    const createdProducts = await prisma.product.createMany({ data: products });
    console.log(`✅ ${createdProducts.count} products seeded`);

    // Sample order
    const allProducts = await prisma.product.findMany({ take: 2 });
    if (allProducts.length >= 2) {
        await prisma.order.create({
            data: {
                userId: customer.id,
                totalAmount: allProducts[0].price + allProducts[1].price,
                status: 'DELIVERED',
                shippingName: 'Yilkal Customer',
                shippingAddress: '123 Main Street',
                shippingCity: 'Addis Ababa',
                shippingPhone: '+251911234567',
                items: {
                    create: [
                        { productId: allProducts[0].id, quantity: 1, price: allProducts[0].price },
                        { productId: allProducts[1].id, quantity: 1, price: allProducts[1].price },
                    ],
                },
            },
        });
        console.log('✅ Sample order created');
    }

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
