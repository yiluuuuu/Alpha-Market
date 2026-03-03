"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    User, Mail, Lock, ArrowRight, Package, ShoppingBag,
    Shield, Calendar, Loader2, CheckCircle, Edit3, Eye, EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const AccountPage = () => {
    const { user, setAuth } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.orders.slice(0, 5));
            } catch {
                // ignore
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setFormData((fd) => ({ ...fd, name: user?.name || '', email: user?.email || '' }));
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: any = { name: formData.name };
            if (formData.newPassword) {
                if (!formData.currentPassword) { toast.error('Enter your current password'); setSubmitting(false); return; }
                payload.currentPassword = formData.currentPassword;
                payload.newPassword = formData.newPassword;
            }
            const res = await api.patch('/auth/profile', payload);
            setAuth(res.data.user, useAuthStore.getState().token!);
            toast.success('Profile updated successfully!');
            setEditMode(false);
            setFormData((fd) => ({ ...fd, currentPassword: '', newPassword: '' }));
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSubmitting(false);
        }
    };

    const statusColors: Record<string, string> = {
        PENDING: 'text-amber-500 bg-amber-50',
        PROCESSING: 'text-blue-500 bg-blue-50',
        SHIPPED: 'text-indigo-600 bg-indigo-50',
        DELIVERED: 'text-emerald-600 bg-emerald-50',
    };

    return (
        <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">My Account</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your profile and view your order history.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100"
                        >
                            {/* Avatar */}
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/5">
                                    <User className="w-12 h-12 text-primary" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
                                <p className="text-sm text-gray-400 font-medium mt-1">{user?.email}</p>
                                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                    <Shield className="w-3 h-3" /> {user?.role}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <p className="text-2xl font-black text-primary">{orders.length}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Orders</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                    <p className="text-2xl font-black text-primary">
                                        ${orders.reduce((s: number, o: any) => s + o.totalAmount, 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Spent</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/5 text-primary font-bold rounded-2xl hover:bg-primary/10 transition-all text-sm"
                            >
                                <Edit3 className="w-4 h-4" /> {editMode ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Edit Form */}
                        {editMode && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100"
                            >
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Update Profile
                                </h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-medium"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <div className="relative">
                                            <input
                                                type="email" disabled
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent outline-none font-medium text-gray-400 cursor-not-allowed"
                                                value={formData.email}
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 ml-1">Email cannot be changed</p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Change Password (optional)</p>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Current Password"
                                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-medium"
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="New Password (min. 6 characters)"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-medium"
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    minLength={6}
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={submitting} className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 mt-6">
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Save Changes</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Recent Orders */}
                        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Recent Orders
                                </h3>
                                <Link href="/orders" className="text-xs font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                                    View All <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {loadingOrders ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-gray-400 text-xs shadow-sm">
                                                    #{order.id.slice(-3).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">Order #{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                                <span className="font-black text-gray-900">${order.totalAmount.toLocaleString()}</span>
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-medium">No orders yet</p>
                                    <Link href="/shop" className="mt-4 inline-block text-primary font-bold text-sm hover:underline">
                                        Start Shopping →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Member Since */}
                        <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alpha Market Member</p>
                                <p className="font-bold text-gray-900">Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default AccountPage;
