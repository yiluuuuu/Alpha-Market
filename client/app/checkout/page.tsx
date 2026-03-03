"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ArrowRight, Loader2, MapPin, Phone, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';

const CheckoutPage = () => {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shippingName: user?.name || '',
        shippingAddress: '',
        shippingCity: '',
        shippingPhone: '',
    });

    // Guard: redirect to cart if empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items, router]);

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                ...formData
            };
            const res = await api.post('/orders', orderData);
            toast.success('Order placed successfully!');
            clearCart();
            router.push(`/order-confirmation?id=${res.data.order.id}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-gray-900 mb-12 tracking-tighter uppercase italic">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Checkout Form */}
                    <div className="flex-1">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handlePlaceOrder}
                            className="space-y-10"
                        >
                            <div className="bg-white p-10 rounded-[40px] shadow-soft border border-gray-100">
                                <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-primary" /> Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium"
                                                placeholder="Recipient Name"
                                                value={formData.shippingName}
                                                onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                                        <div className="relative">
                                            <input
                                                type="tel" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium"
                                                placeholder="+251..."
                                                value={formData.shippingPhone}
                                                onChange={(e) => setFormData({ ...formData, shippingPhone: e.target.value })}
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Shipping Address</label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium"
                                                placeholder="Street, Building, Apartment"
                                                value={formData.shippingAddress}
                                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                            />
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">City</label>
                                        <input
                                            type="text" required
                                            className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary/20 transition-all outline-none font-medium"
                                            placeholder="Addis Ababa"
                                            value={formData.shippingCity}
                                            onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-10 rounded-[40px] shadow-soft border border-gray-100 italic">
                                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-primary" /> Payment Method
                                </h2>
                                <div className="p-6 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-primary/20 rounded-md flex items-center justify-center font-bold text-primary">CASH</div>
                                        <div>
                                            <p className="font-bold text-gray-900">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500">Fast & Secure hand-to-hand payment</p>
                                        </div>
                                    </div>
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </motion.form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="w-full lg:w-96">
                        <div className="bg-white p-8 rounded-[32px] shadow-premium border border-primary/5 sticky top-32">
                            <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">Your Order</h2>
                            <div className="max-h-60 overflow-y-auto pr-2 mb-8 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-500 line-clamp-1 flex-1">{item.name} <span className="text-primary font-bold ml-1">x{item.quantity}</span></span>
                                        <span className="text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-500 font-medium italic">
                                    <span>Shipping Fee</span>
                                    <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">FREE</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900 uppercase">Total Amount</span>
                                    <span className="text-3xl font-black text-primary tracking-tighter">${getTotal().toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || items.length === 0}
                                className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        Confirm Order
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <Truck className="w-4 h-4" /> Eco-friendly delivery
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default CheckoutPage;
