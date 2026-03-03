"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import api from '@/lib/axios';

const CATEGORIES = [
    { name: 'EarPods', icon: '🎧', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-100', desc: 'Premium wireless audio for every occasion' },
    { name: 'Watches', icon: '⌚', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Smart & classic timepieces for every wrist' },
    { name: 'Scientific Calculators', icon: '➗', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-100', desc: 'Precision tools for students & engineers' },
    { name: 'Used PCs', icon: '💻', gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', border: 'border-purple-100', desc: 'Refurbished laptops & desktops at great value' },
];

const CategoriesPage = () => {
    const [counts, setCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await api.get('/products');
                const products: any[] = res.data.products;
                const c: Record<string, number> = {};
                products.forEach((p) => {
                    c[p.category] = (c[p.category] || 0) + 1;
                });
                setCounts(c);
            } catch {
                // silently fail — static counts are fallback
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20"
            >
                <span className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full mb-6">
                    <Package className="w-4 h-4" /> Browse by Category
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-6">
                    SHOP BY <br /><span className="text-primary italic">CATEGORY</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                    Explore our curated range of premium tech products, handpicked for enthusiasts and professionals alike.
                </p>
            </motion.div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                {CATEGORIES.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -6 }}
                    >
                        <Link
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className={`group block p-10 ${cat.bg} rounded-[40px] border-2 ${cat.border} hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                        >
                            {/* Background gradient on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[40px]`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="text-7xl group-hover:scale-110 transition-transform duration-500 inline-block">
                                        {cat.icon}
                                    </div>
                                    <div className="p-4 bg-white/80 rounded-2xl shadow-sm group-hover:shadow-md transition-all">
                                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{cat.name}</h2>
                                <p className="text-gray-500 font-medium mb-6 leading-relaxed">{cat.desc}</p>

                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-black uppercase tracking-widest bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}>
                                        {counts[cat.name] ?? '—'} Products
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                                        View All →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-primary rounded-[40px] p-12 md:p-16 text-center text-white relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-indigo-200 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        Browse our entire collection and use filters to find exactly what you need.
                    </p>
                    <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl">
                        Browse Full Shop <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
            </motion.div>
        </div>
    );
};

export default CategoriesPage;
