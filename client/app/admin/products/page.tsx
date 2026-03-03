"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Search, X, Loader2, Camera } from 'lucide-react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast from 'react-hot-toast';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const categories = ['EarPods', 'Watches', 'Scientific Calculators', 'Used PCs'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data.products);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                stock: product.stock.toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock: '' });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (imageFile) data.append('image', imageFile);

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchProducts();
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Inventory Center</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage your elite product collection.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-lg"
                    >
                        <Plus className="w-6 h-6" /> Add New Product
                    </button>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-[40px] shadow-soft border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                                                <img src={p.image.startsWith('/') ? `http://localhost:5000${p.image}` : p.image} alt={p.name} className="object-cover w-full h-full" />
                                            </div>
                                            <span className="font-bold text-gray-900 line-clamp-1">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-primary tracking-widest uppercase bg-primary/5 px-3 py-1 rounded-full">{p.category}</span>
                                    </td>
                                    <td className="px-8 py-6 text-lg font-black text-gray-900">${p.price.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <span className={`text-sm font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-gray-600'}`}>{p.stock} Units</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenModal(p)} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && !loading && <div className="p-20 text-center text-gray-400 font-bold uppercase italic tracking-widest">No products found.</div>}
                </div>

                {/* CRUD Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative z-10"
                            >
                                <div className="p-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">{editingProduct ? 'Update Product' : 'Create New Tech'}</h2>
                                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-6 h-6 text-gray-400" /></button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Product Name</label>
                                                <input required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Category</label>
                                                <select required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-bold" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Price ($)</label>
                                                <input type="number" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-bold" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Stock Amount</label>
                                                <input type="number" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-bold" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                                            <textarea required rows={3} className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 outline-none font-bold resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                        </div>

                                        <div className="p-6 border-2 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/20 transition-all relative">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                            <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{imageFile ? imageFile.name : 'Upload Product Image'}</p>
                                        </div>

                                        <button disabled={loading} type="submit" className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg mt-10">
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingProduct ? 'Save Changes' : 'Launch Product')}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
};

export default ProductManagement;
