"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, Award } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const Home = () => {
    const featuredProducts = [
        {
            id: '1',
            name: 'Apple-style Wireless EarPods',
            price: 1299,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
            category: 'EarPods',
        },
        {
            id: '2',
            name: 'Smart Digital Watch',
            price: 2499,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            category: 'Watches',
        },
        {
            id: '3',
            name: 'FX-991ES Plus Calculator',
            price: 1199,
            image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=500',
            category: 'Scientific Calculators',
        },
        {
            id: '4',
            name: 'Used HP Laptop',
            price: 18999,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
            category: 'Used PCs',
        },
    ];

    const categories = [
        { name: 'EarPods', icon: '🎧', count: 12, bg: 'bg-blue-50' },
        { name: 'Watches', icon: '⌚', count: 8, bg: 'bg-emerald-50' },
        { name: 'Calculators', icon: '➗', count: 15, bg: 'bg-amber-50' },
        { name: 'Used PCs', icon: '💻', count: 10, bg: 'bg-purple-50' },
    ];

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-white pb-20 pt-16 lg:pb-32 lg:pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-8 text-primary font-bold text-sm"
                            >
                                <Zap className="w-4 h-4" />
                                <span>New Arrival: Limited Edition Smart Watches</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-8"
                            >
                                LEVEL UP YOUR <br />
                                <span className="text-primary italic">TECH GAME.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-gray-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Experience the intersection of premium design and cutting-edge technology. Explore our curated collection of elite gadgets.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Link href="/shop" className="btn-primary flex items-center group w-full sm:w-auto justify-center">
                                    Shop Collection
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/categories" className="btn-secondary w-full sm:w-auto justify-center flex items-center">
                                    Explore Categories
                                </Link>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            <div className="relative z-10 p-4">
                                <div className="aspect-square relative rounded-[40px] overflow-hidden shadow-2xl">
                                    <Image
                                        src="/images/earpod3.jpg"
                                        alt="Premium Watch"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-10 left-10 text-white">
                                        <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Featured Item</p>
                                        <h2 className="text-3xl font-black">Titanium Series Pro</h2>
                                        <p className="text-2xl font-black mt-2 text-accent">$2,499</p>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract blobs */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {[
                            { icon: Shield, title: 'Secure Payment', desc: '100% encrypted checkout process' },
                            { icon: Globe, title: 'Free Shipping', desc: 'On all orders over $10,000' },
                            { icon: Award, title: 'Quality Guarantee', desc: '6 months warranty on all items' },
                            { icon: Zap, title: 'Fast Delivery', desc: 'Get your tech in 24-48 hours' },
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-soft">
                                <div className="p-4 bg-primary/5 rounded-2xl mb-6">
                                    <f.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Showcase */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4 uppercase">Popular Categories</h2>
                        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">Shop our diverse range of premium products specifically curated for tech enthusiasts and students.</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className={`p-10 ${cat.bg} rounded-3xl group cursor-pointer border border-transparent hover:border-primary/10 transition-all`}
                            >
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                                <p className="text-primary font-semibold mt-2 text-sm">{cat.count}+ Items</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div className="text-left">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2 uppercase">TRENDING TECH</h2>
                            <p className="text-gray-500">Discover our most sought-after products this week.</p>
                        </div>
                        <Link href="/shop" className="text-primary font-bold hover:underline flex items-center gap-2 mb-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((p) => (
                            <ProductCard key={p.id} product={p as any} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white px-4">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    className="max-w-5xl mx-auto bg-primary rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">READY TO UPGRADE <br /> YOUR LIFESTYLE?</h2>
                        <p className="text-indigo-100 text-lg mb-12 max-w-xl mx-auto opacity-90 leading-relaxed">
                            Join thousands of satisfied customers who have improved their productivity and style with Alpha Market tech.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/auth/register" className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all w-full sm:w-auto shadow-2xl">
                                Join Now for Free
                            </Link>
                            <Link href="/shop" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all w-full sm:w-auto">
                                Browse Shop
                            </Link>
                        </div>
                    </div>
                    {/* Abstract circles */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
