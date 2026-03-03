"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/axios';

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch (err) {
                console.error(err);
                // Fallback for demo
                const mockProducts: any = {
                    '1': { id: '1', name: 'Apple-style Wireless EarPods', price: 1299, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', category: 'EarPods', description: 'Experience pure sound with zero wires. These premium earpods provide industry-leading audio quality, seamless connectivity, and all-day comfort.', stock: 50 },
                    '2': { id: '2', name: 'Smart Digital Watch', price: 2499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', category: 'Watches', description: 'Stay connected and track your health in style. Featuring a stunning AMOLED display, heart rate tracking, and 7-day battery life.', stock: 25 },
                };
                setProduct(mockProducts[id as string] || mockProducts['1']);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="pt-32 pb-20 text-center text-gray-500 font-bold">Loading product details...</div>;
    if (!product) return <div className="pt-32 pb-20 text-center text-gray-500 font-bold">Product not found.</div>;

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-primary mb-10 transition-colors font-bold uppercase tracking-widest text-xs"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <div className="relative aspect-square rounded-[40px] overflow-hidden bg-gray-50 shadow-soft border border-gray-100 group">
                        <Image
                            src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <div className="mb-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full mb-6 inline-block">
                            {product.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter leading-tight uppercase">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-4 h-4 text-accent fill-accent" />
                            ))}
                            <span className="text-sm text-gray-400 font-medium ml-2">(128 Customer Reviews)</span>
                        </div>
                    </div>

                    <p className="text-4xl font-black text-primary mb-8 tracking-tight italic">
                        ${product.price.toLocaleString()}
                    </p>

                    <p className="text-gray-500 mb-10 leading-relaxed text-lg italic">
                        "{product.description}"
                    </p>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Official Warranty</p>
                                <p className="text-xs text-gray-500">6 Months protection included</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Express Delivery</p>
                                <p className="text-xs text-gray-500">Usually arrives in 24-48 hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => addItem(product)}
                            className="flex-1 btn-primary py-5 text-lg flex items-center justify-center gap-3 shadow-2xl"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            Add to Shopping Cart
                        </button>
                        <button className="px-8 py-5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                            <RefreshCcw className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold text-gray-600">
                            {product.stock > 0 ? `${product.stock} units currently in stock` : 'Currently Out of Stock'}
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;
