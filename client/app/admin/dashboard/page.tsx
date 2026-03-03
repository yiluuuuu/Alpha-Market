"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Package, ShoppingBag, DollarSign,
    ArrowUpRight, Clock, AlertTriangle, ChevronRight,
    TrendingUp, Users, Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await api.get('/dashboard/stats', { params: { period } });
                setStats(res.data);
            } catch (err) {
                console.error(err);
                // Fallback for demo
                setStats({
                    totalProducts: 8,
                    totalOrders: 15,
                    totalRevenue: 45890,
                    recentOrders: [
                        { id: '1', user: { name: 'Yilkal Customer' }, totalAmount: 3500, status: 'DELIVERED', createdAt: new Date() },
                        { id: '2', user: { name: 'John Doe' }, totalAmount: 1200, status: 'PROCESSING', createdAt: new Date() },
                    ],
                    lowStockProducts: [
                        { name: 'Used HP Laptop', stock: 5 },
                        { name: 'Used Dell Desktop PC', stock: 8 },
                    ],
                    salesChart: [
                        { date: 'Mon', revenue: 4000 },
                        { date: 'Tue', revenue: 3000 },
                        { date: 'Wed', revenue: 5000 },
                        { date: 'Thu', revenue: 8000 },
                        { date: 'Fri', revenue: 7000 },
                        { date: 'Sat', revenue: 9000 },
                        { date: 'Sun', revenue: 11000 },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [period]);

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100 group hover:shadow-premium transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                {trend && (
                    <span className="flex items-center text-emerald-500 font-black text-xs uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-4 h-4 mr-1" /> {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
            </div>
        </div>
    );

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Control Center</h1>
                        <p className="text-gray-500 mt-2 font-medium">Overview of your Alpha Market empire.</p>
                    </div>
                    <div className="flex bg-white p-2 rounded-2xl shadow-soft border border-gray-100">
                        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${period === p
                                        ? 'bg-primary text-white shadow-premium'
                                        : 'text-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard title="Total Revenue" value={`$${stats?.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-primary" trend="+12% Since Mon" />
                    <StatCard title="Total Orders" value={stats?.totalOrders} icon={ShoppingBag} color="bg-secondary" trend="+5 New Today" />
                    <StatCard title="Total Products" value={stats?.totalProducts} icon={Package} color="bg-amber-500" />
                    <StatCard title="Total Customers" value="84" icon={Users} color="bg-purple-500" trend="+3 New" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-soft border border-gray-100">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary" /> Sales Performance
                            </h2>
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.salesChart || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94A3B8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94A3B8' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 'bold', color: '#4F46E5' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-12">
                        {/* Low Stock Alerts */}
                        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-red-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Low Stock Warning
                            </h2>
                            <div className="space-y-4">
                                {stats?.lowStockProducts.map((p: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</span>
                                        <span className="text-xs font-black text-red-600 bg-white px-2 py-1 rounded-lg">{p.stock} Left</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Orders List */}
                        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" /> Recently Placed
                            </h2>
                            <div className="space-y-6">
                                {stats?.recentOrders.map((order: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center font-black text-primary text-xs">#{order.id.slice(-2)}</div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{order.user?.name || order.shippingName || 'Customer'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.status}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AdminDashboard;
