"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Package, Clock, CheckCircle2, Truck, Eye, ShoppingBag,
    ArrowRight, Loader2, RefreshCw
} from 'lucide-react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    PENDING: { color: 'text-amber-500 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
    PROCESSING: { color: 'text-blue-500 bg-blue-50 border-blue-200', icon: <Package className="w-4 h-4" />, label: 'Processing' },
    SHIPPED: { color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: <Truck className="w-4 h-4" />, label: 'Shipped' },
    DELIVERED: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Delivered' },
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders');
            setOrders(res.data.orders);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    return (
        <ProtectedRoute>
            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Orders</h1>
                        <p className="text-gray-400 mt-2 font-medium">
                            {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-3 bg-white rounded-2xl shadow-soft border border-gray-100 text-gray-500 hover:text-primary transition-all hover:shadow-premium group"
                    >
                        <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-100 animate-pulse rounded-3xl" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-xl font-black text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-400 font-medium mb-8">Start shopping to see your orders here</p>
                        <Link href="/shop" className="btn-primary py-4 px-8 rounded-2xl inline-flex items-center gap-2">
                            Shop Now <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, i) => {
                            const sc = statusConfig[order.status] || statusConfig.PENDING;
                            const itemCount = order.items?.length || 0;
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white p-6 rounded-[28px] shadow-soft border border-gray-100 hover:shadow-premium transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        {/* Order info */}
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-2xl border ${sc.color}`}>
                                                {sc.icon}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="font-black text-gray-900 text-lg tracking-tight">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${sc.color}`}>
                                                        {sc.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-medium mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {itemCount > 0 && <> · {itemCount} item{itemCount !== 1 ? 's' : ''}</>}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Total + actions */}
                                        <div className="flex items-center gap-4 sm:ml-auto">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                                                <p className="text-xl font-black text-gray-900">${order.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 text-primary rounded-2xl font-bold text-sm hover:bg-primary text-primary hover:text-white transition-all group"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Details</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Items preview */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                            {order.items.slice(0, 3).map((item: any, ii: number) => (
                                                <span key={ii} className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                                                    {item.product?.name?.slice(0, 20) || 'Product'}{item.product?.name?.length > 20 ? '...' : ''} ×{item.quantity}
                                                </span>
                                            ))}
                                            {order.items.length > 3 && (
                                                <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-xl">+{order.items.length - 3} more</span>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default OrdersPage;
