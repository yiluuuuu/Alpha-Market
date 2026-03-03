"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, Eye, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.orders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />;
            case 'PROCESSING': return <Package className="w-5 h-5 text-blue-500" />;
            case 'SHIPPED': return <Truck className="w-5 h-5 text-primary" />;
            case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-secondary" />;
            default: return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <ProtectedRoute>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Order History</h1>
                        <p className="text-gray-500 mt-2 font-medium">Track your premium tech deliveries.</p>
                    </div>
                    <Link href="/shop" className="text-primary font-bold flex items-center gap-2 hover:underline mb-2">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse" />)}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order.id}
                                className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100 hover:shadow-premium transition-all group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                            <Package className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Order #{order.id.slice(-6).toUpperCase()}</h3>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 w-full md:w-auto">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
                                            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-tighter italic">
                                                {getStatusIcon(order.status)}
                                                <span className={order.status === 'DELIVERED' ? 'text-secondary' : 'text-gray-900'}>{order.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-xl font-black text-primary tracking-tighter">${order.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <button className="p-4 bg-gray-50 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all self-center">
                                            <Eye className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Micro product preview */}
                                <div className="mt-8 pt-8 border-t border-gray-50 flex gap-4 overflow-x-auto pb-2">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-gray-50/50 px-4 py-2 rounded-xl">
                                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-[10px] font-black">{item.quantity}x</div>
                                            <span className="text-xs font-bold text-gray-600 line-clamp-1">{item.product?.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] shadow-soft border border-dashed border-gray-200">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your purchase history is waiting to be filled with premium tech gear.</p>
                        <Link href="/shop" className="btn-primary py-4 px-10 rounded-2xl inline-block">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};

export default OrdersPage;
