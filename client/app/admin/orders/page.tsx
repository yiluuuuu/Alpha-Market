"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Package, Search, ChevronDown, Clock, Truck, CheckCircle2,
    RotateCcw, Loader2, RefreshCw, User, Calendar, DollarSign, Filter
} from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

const ALL_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    PENDING: { color: 'text-amber-500 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" /> },
    PROCESSING: { color: 'text-blue-500 bg-blue-50 border-blue-200', icon: <Package className="w-4 h-4" /> },
    SHIPPED: { color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: <Truck className="w-4 h-4" /> },
    DELIVERED: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" /> },
};

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/all');
            setOrders(res.data.orders);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order updated to ${newStatus}`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders.filter((o) => {
        const q = search.toLowerCase();
        const matchesSearch = !q || o.id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.shippingName?.toLowerCase().includes(q);
        const matchesStatus = !statusFilter || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Order Management</h1>
                        <p className="text-gray-400 mt-1 font-medium">{loading ? 'Loading...' : `${filtered.length} of ${orders.length} orders`}</p>
                    </div>
                    <button onClick={fetchOrders} className="p-3 bg-white rounded-2xl shadow-soft border border-gray-100 hover:text-primary transition-all group">
                        <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-all duration-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <input
                            type="text" value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID or customer name..."
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-10 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-soft font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-40"
                        >
                            <option value="">All Statuses</option>
                            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>

                {/* Order List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-3xl" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order, i) => {
                            const sc = statusConfig[order.status] || statusConfig.PENDING;
                            const isExpanded = expandedId === order.id;
                            const isUpdating = updatingId === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-[28px] shadow-soft border border-gray-100 overflow-hidden"
                                >
                                    {/* Order row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6">
                                        <div className={`p-3 rounded-2xl border ${sc.color} hidden sm:flex`}>{sc.icon}</div>

                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                                <p className="font-black text-gray-900 mt-0.5">#{order.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><User className="w-3 h-3" /> Customer</p>
                                                <p className="font-bold text-gray-700 mt-0.5 text-sm">{order.shippingName || order.user?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                                                <p className="font-bold text-gray-700 mt-0.5 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><DollarSign className="w-3 h-3" /> Total</p>
                                                <p className="font-black text-gray-900 mt-0.5">${order.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Status badge */}
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border hidden sm:inline-block ${sc.color}`}>
                                                {order.status}
                                            </span>

                                            {/* Details toggle */}
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 rounded-xl text-xs font-bold transition-all"
                                            >
                                                Details
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded detail panel */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-gray-50 p-6 bg-gray-50/50"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Items */}
                                                <div>
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Items Ordered</p>
                                                    <div className="space-y-3">
                                                        {order.items?.map((item: any, ii: number) => (
                                                            <div key={ii} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl">
                                                                <span className="font-bold text-gray-700 line-clamp-1 flex-1">{item.product?.name || 'Product'}</span>
                                                                <span className="text-gray-400 font-medium ml-4">×{item.quantity}</span>
                                                                <span className="font-black text-gray-900 ml-4">${(item.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Shipping + Status */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Shipping Info</p>
                                                        <div className="bg-white p-4 rounded-xl space-y-2 text-sm">
                                                            <p><span className="font-black text-gray-400">Name: </span><span className="font-bold text-gray-900">{order.shippingName || order.user?.name}</span></p>
                                                            <p><span className="font-black text-gray-400">Address: </span><span className="font-bold text-gray-900">{order.shippingAddress}</span></p>
                                                            <p><span className="font-black text-gray-400">City: </span><span className="font-bold text-gray-900">{order.shippingCity}</span></p>
                                                            <p><span className="font-black text-gray-400">Phone: </span><span className="font-bold text-gray-900">{order.shippingPhone}</span></p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Update Status</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ALL_STATUSES.map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleStatusUpdate(order.id, s)}
                                                                    disabled={order.status === s || isUpdating}
                                                                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all border ${order.status === s
                                                                            ? `${statusConfig[s].color} cursor-default`
                                                                            : 'bg-white text-gray-400 border-gray-200 hover:border-primary hover:text-primary'
                                                                        } disabled:opacity-50`}
                                                                >
                                                                    {isUpdating && order.status !== s ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
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

export default AdminOrdersPage;
