"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ShoppingCart, ArrowLeft, Check, Minus, Plus,
    Star, Shield, Truck, RotateCcw, Package, Loader2
} from 'lucide-react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    const addItem = useCartStore((s) => s.addItem);
    const cartItems = useCartStore((s) => s.items);
    const inCartQty = cartItems.find((i) => i.id === id)?.quantity ?? 0;

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
            } catch {
                toast.error('Product not found');
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetch();
    }, [id, router]);

    const handleAddToCart = () => {
        if (!product) return;
        const remaining = product.stock - inCartQty;
        if (remaining <= 0) { toast.error('Maximum stock already in cart!'); return; }
        const toAdd = Math.min(quantity, remaining);
        for (let i = 0; i < toAdd; i++) {
            addItem({ id: product.id, name: product.name, price: product.price, image: product.image, stock: product.stock });
        }
        toast.success(`${toAdd}× ${product.name.slice(0, 20)}... added!`, { icon: '🛒' });
    };

    if (loading) {
        return (
            <div className="pt-40 flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!product) return null;

    const imageUrl = product.image?.startsWith('/') ? `http://localhost:5000${product.image}` : product.image;
    const stockLeft = product.stock - inCartQty;

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10 font-medium">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                <span>/</span>
                <span className="text-gray-700 font-semibold line-clamp-1">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="aspect-square relative rounded-[40px] overflow-hidden bg-gray-50 shadow-2xl border border-gray-100">
                        {!imgError ? (
                            <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized={imageUrl?.startsWith('http://localhost')}
                                onError={() => setImgError(true)}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Package className="w-24 h-24 text-gray-300" />
                            </div>
                        )}
                        {/* Category badge */}
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                                {product.category}
                            </span>
                        </div>
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-lg font-black text-red-600 bg-red-50 px-6 py-3 rounded-2xl border border-red-200 uppercase tracking-widest">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Decorative blobs */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                >
                    {/* Rating placeholder */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                        <span className="text-sm text-gray-400 font-medium ml-1">(4.2 · 128 reviews)</span>
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight mb-4">{product.name}</h1>
                        <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black text-primary tracking-tighter">${product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 font-medium">USD · Cash on Delivery</span>
                    </div>

                    {/* Stock status */}
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-secondary' : product.stock > 0 ? 'bg-amber-400' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold text-gray-600">
                            {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left!` : `In Stock (${product.stock} units)`}
                        </span>
                        {inCartQty > 0 && (
                            <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
                                {inCartQty} in cart
                            </span>
                        )}
                    </div>

                    {/* Quantity + Add to Cart */}
                    {product.stock > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gray-50 rounded-2xl p-2 gap-3 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-600 hover:text-primary"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-10 text-center font-black text-gray-900 text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(stockLeft, quantity + 1))}
                                        disabled={quantity >= stockLeft}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all text-gray-600 hover:text-primary disabled:opacity-30"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-400 font-medium">Max {stockLeft} available</span>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={stockLeft <= 0}
                                    className="flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold disabled:opacity-50"
                                >
                                    {inCartQty > 0 ? <Check className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                    {inCartQty > 0 ? 'Add More to Cart' : 'Add to Cart'}
                                </button>
                                <Link
                                    href="/cart"
                                    className="btn-secondary py-5 px-6 rounded-2xl flex items-center justify-center"
                                >
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                        {[
                            { icon: Shield, label: '6-Mo Warranty' },
                            { icon: Truck, label: 'Fast Delivery' },
                            { icon: RotateCcw, label: 'Easy Returns' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl text-center">
                                <Icon className="w-5 h-5 text-primary" />
                                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{label}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/shop" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mt-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Shop
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
