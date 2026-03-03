"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const CartPage = () => {
    const { items, removeItem, updateQuantity, getTotal, getCount } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 text-center">
                <div className="bg-white p-20 rounded-[40px] shadow-soft inline-block group">
                    <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-16 h-16 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">YOUR CART IS HUNGRY</h1>
                    <p className="text-gray-500 text-lg mb-10 max-w-sm mx-auto italic">Looks like you haven't added anything to your cart yet. Let's fix that!</p>
                    <Link href="/shop" className="btn-primary py-4 px-10 rounded-2xl block text-center">
                        Go Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase italic">Shopping Cart ({getCount()})</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Items List */}
                <div className="flex-1 space-y-6">
                    {items.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex items-center gap-6"
                        >
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                <Image
                                    src={item.image.startsWith('/') ? `http://localhost:5000${item.image}` : item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{item.name}</h3>
                                <p className="text-primary font-black mt-1">${item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-white rounded-lg transition-all"
                                >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-white rounded-lg transition-all"
                                >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Summary Card */}
                <aside className="w-full lg:w-96">
                    <div className="bg-white p-8 rounded-[32px] shadow-premium border border-primary/5 sticky top-32">
                        <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>${getTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Calculated at Checkout</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900 uppercase">Total Amount</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">${getTotal().toLocaleString()}</span>
                            </div>
                        </div>
                        <Link href="/checkout" className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg">
                            <CreditCard className="w-6 h-6" />
                            Secure Checkout
                        </Link>
                        <Link href="/shop" className="block text-center mt-6 text-sm font-bold text-gray-400 hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Continue Shopping
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CartPage;
