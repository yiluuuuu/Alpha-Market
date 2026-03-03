"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderConfirmationContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');

    return (
        <div className="pt-40 pb-20 max-w-2xl mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 md:p-20 rounded-[40px] shadow-premium border border-primary/5"
            >
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-secondary" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">ORDER CONFIRMED</h1>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed italic">
                    Thank you for your purchase! Your order <span className="text-primary font-bold">#{orderId?.slice(-6).toUpperCase()}</span> has been placed successfully.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                    <Link href="/orders" className="btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-2">
                        <Package className="w-5 h-5" /> View My Orders
                    </Link>
                    <Link href="/shop" className="btn-secondary py-4 px-8 rounded-2xl flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Back to Shop
                    </Link>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-50">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Next Steps</p>
                    <p className="text-sm text-gray-500 italic">You will receive an email confirmation with tracking details shortly. Our team is currently preparing your tech!</p>
                </div>
            </motion.div>
        </div>
    );
};

const OrderConfirmationPage = () => {
    return (
        <Suspense fallback={<div className="pt-40 text-center">Loading confirmation...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
};

export default OrderConfirmationPage;
