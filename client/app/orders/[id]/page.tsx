"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Package, Clock, CheckCircle2, Truck, ArrowLeft,
    MapPin, Phone, User as UserIcon, Calendar, Loader2
} from 'lucide-react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'PENDING': return <Clock className="w-5 h-5" />;
        case 'PROCESSING': return <Package className="w-5 h-5" />;
        case 'SHIPPED': return <Truck className="w-5 h-5" />;
        case 'DELIVERED': return <CheckCircle2 className="w-5 h-5" />;
        default: return <Clock className="w-5 h-5" />;
    }
};

const statusColors: Record<string, string> = {
    PENDING: 'text-amber-500 bg-amber-50 border-amber-200',
    PROCESSING: 'text-blue-500 bg-blue-50 border-blue-200',
    SHIPPED: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    DELIVERED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data.order);
            } catch {
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id, router]);

    if (loading) {
        return (
            <div className="pt-40 flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!order) return null;

    const currentStep = STATUS_STEPS.indexOf(order.status);

    return (
        <ProtectedRoute>
            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href="/orders" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Back to Orders
                        </Link>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                            Order #{order.id.slice(-6).toUpperCase()}
                        </h1>
                        <p className="text-gray-400 font-medium mt-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-widest border ${statusColors[order.status]}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Timeline + Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Timeline */}
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Order Progress</h2>
                            <div className="flex items-center justify-between relative">
                                {/* Track line */}
                                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 z-0">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>

                                {STATUS_STEPS.map((step, idx) => {
                                    const done = idx <= currentStep;
                                    return (
                                        <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                            <motion.div
                                                initial={{ scale: 0.5 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${done
                                                        ? 'bg-primary border-primary text-white shadow-premium'
                                                        : 'bg-white border-gray-200 text-gray-300'
                                                    }`}
                                            >
                                                {done ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                                            </motion.div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${done ? 'text-primary' : 'text-gray-300'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Items Ordered</h2>
                            <div className="space-y-6">
                                {order.items?.map((item: any, idx: number) => {
                                    const imgUrl = item.product?.image?.startsWith('/')
                                        ? `http://localhost:5000${item.product.image}`
                                        : item.product?.image;
                                    return (
                                        <div key={idx} className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                                {imgUrl && (
                                                    <Image
                                                        src={imgUrl}
                                                        alt={item.product?.name || 'Product'}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized={imgUrl?.startsWith('http://localhost')}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</h3>
                                                <p className="text-sm text-gray-400 font-medium mt-1">
                                                    ${item.price.toLocaleString()} × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-black text-gray-900 text-lg whitespace-nowrap">
                                                ${(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary + Shipping */}
                    <div className="space-y-8">
                        {/* Order Total */}
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-bold">Free</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-black text-primary">${order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Payment Method</p>
                                <p className="font-black text-gray-900 mt-1">Cash on Delivery</p>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Shipping Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <UserIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</p>
                                        <p className="font-bold text-gray-900">{order.shippingName || order.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</p>
                                        <p className="font-bold text-gray-900">{order.shippingAddress}</p>
                                        <p className="text-sm text-gray-500">{order.shippingCity}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                        <p className="font-bold text-gray-900">{order.shippingPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default OrderDetailPage;
