"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, Eye, SlidersHorizontal, User as UserIcon, Calendar, Search } from 'lucide-react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success('Status updated');
            fetchOrders();
        } catch {
            toast.error('Update failed');
        }
    };

    const statusColors: any = {
        PENDING: 'text-amber-500 bg-amber-50',
        PROCESSING: 'text-blue-500 bg-blue-50',
        SHIPPED: 'text-primary bg-primary/5',
        DELIVERED: 'text-secondary bg-secondary/5',
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Order Logistics</h1>
                        <p className="text-gray-500 mt-2 font-medium">Fulfillment and status tracking.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <input
                            type="text" placeholder="Search Order ID..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft font-medium outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100 group">
                            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400">#{order.id.slice(-4).toUpperCase()}</div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-gray-900 uppercase">Order #{order.id.slice(-6).toUpperCase()}</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {order.user.name}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="text-right flex-1 min-w-[120px]">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Revenue</p>
                                        <p className="text-2xl font-black text-primary tracking-tighter">${order.totalAmount.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            className="bg-transparent text-xs font-black uppercase tracking-widest text-gray-600 outline-none cursor-pointer px-2"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </div>

                                    <button className="btn-secondary py-3 px-6 rounded-xl text-xs flex items-center gap-2">
                                        <Eye className="w-4 h-4" /> Details
                                    </button>
                                </div>
                            </div>

                            {/* Items strip */}
                            <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {order.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex flex-col items-center text-center p-3 bg-gray-50/50 rounded-2xl">
                                        <div className="w-10 h-10 relative rounded-lg overflow-hidden mb-2 bg-white border border-gray-100">
                                            <img src={item.product?.image.startsWith('/') ? `http://localhost:5000${item.product.image}` : item.product?.image} className="object-cover w-full h-full" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 line-clamp-1">{item.product?.name}</span>
                                        <span className="text-[10px] font-black text-primary uppercase">Qty: {item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default OrderManagement;
