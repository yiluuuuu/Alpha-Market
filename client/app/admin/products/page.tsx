"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Edit3, Trash2, Search, Image as ImageIcon, X,
    Loader2, Package, RefreshCw, Upload, AlertCircle, Check
} from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

const CATEGORIES = ['EarPods', 'Watches', 'Scientific Calculators', 'Used PCs'];

const emptyForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: CATEGORIES[0],
};

const AdminProductsPage = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data.products);
        } catch { toast.error('Failed to load products'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const openModal = (product?: any) => {
        if (product) {
            setEditing(product);
            setForm({
                name: product.name,
                description: product.description || '',
                price: String(product.price),
                stock: String(product.stock),
                category: product.category,
            });
            const existingImg = product.image?.startsWith('/') ? `http://localhost:5000${product.image}` : product.image;
            setImagePreview(existingImg || '');
        } else {
            setEditing(null);
            setForm(emptyForm);
            setImagePreview('');
        }
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('stock', form.stock);
            formData.append('category', form.category);
            if (imageFile) formData.append('image', imageFile);

            if (editing) {
                await api.put(`/products/${editing.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product updated!');
            } else {
                await api.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Product created!');
            }

            closeModal();
            fetchProducts();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product? This action cannot be undone.')) return;
        setDeletingId(id);
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success('Product deleted');
        } catch { toast.error('Failed to delete product'); }
        finally { setDeletingId(null); }
    };

    const filtered = products.filter((p) =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Products</h1>
                        <p className="text-gray-400 font-medium mt-1">{loading ? '...' : `${filtered.length} of ${products.length} products`}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={fetchProducts} className="p-3 bg-white rounded-2xl shadow-soft border border-gray-100 text-gray-400 hover:text-primary transition-all group">
                            <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-all duration-500 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 py-3 px-6 rounded-2xl">
                            <Plus className="w-5 h-5" /> Add Product
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or category..."
                        className="w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                </div>

                {/* Products Table */}
                {loading ? (
                    <div className="space-y-4">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-2xl" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No products found</p>
                        <button onClick={() => openModal()} className="mt-6 btn-primary py-3 px-6 rounded-2xl text-sm">Add your first product</button>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] shadow-soft border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="border-b border-gray-50">
                                <tr>
                                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                                        <th key={h} className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((p, i) => {
                                    const imgUrl = p.image?.startsWith('/') ? `http://localhost:5000${p.image}` : p.image;
                                    return (
                                        <motion.tr
                                            key={p.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
                                                        {imgUrl ? (
                                                            <Image src={imgUrl} alt={p.name} fill className="object-cover" unoptimized={imgUrl.startsWith('http://localhost')} />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-5 h-5" /></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</p>
                                                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg">{p.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-gray-900">${p.price.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${p.stock === 0 ? 'text-red-500 bg-red-50' : p.stock <= 5 ? 'text-amber-500 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                                    {p.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openModal(p)} className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl transition-all">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        disabled={deletingId === p.id}
                                                        className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                                                    >
                                                        {deletingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={(e) => e.target === e.currentTarget && closeModal()}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            >
                                <div className="p-8">
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                            {editing ? 'Edit Product' : 'Add New Product'}
                                        </h2>
                                        <button onClick={closeModal} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all">
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Image Upload */}
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Product Image</p>
                                            <div
                                                className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer ${imagePreview ? 'border-primary/30' : 'border-gray-200 hover:border-primary/40'}`}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}
                                                onClick={() => fileRef.current?.click()}
                                            >
                                                {imagePreview ? (
                                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); setImagePreview(''); setImageFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                                                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-md transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                                            <Check className="w-3.5 h-3.5 text-emerald-500" /> Image ready
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-40 flex flex-col items-center justify-center gap-3 text-gray-400">
                                                        <Upload className="w-8 h-8" />
                                                        <div className="text-center">
                                                            <p className="font-bold text-sm">Drag & drop or click to upload</p>
                                                            <p className="text-xs text-gray-300 mt-1">PNG, JPG, WEBP — max 5MB</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </div>

                                        {/* Name */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Product Name *</label>
                                            <input
                                                required value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="e.g. Sony WH-1000XM5"
                                                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                                            <textarea
                                                rows={3} value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                placeholder="Describe the product features..."
                                                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 outline-none font-medium resize-none"
                                            />
                                        </div>

                                        {/* Price + Stock */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price (USD) *</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                    <input
                                                        required type="number" step="0.01" min="0" value={form.price}
                                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                                        placeholder="0.00"
                                                        className="w-full pl-8 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Stock Units *</label>
                                                <input
                                                    required type="number" min="0" value={form.stock}
                                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                                    placeholder="0"
                                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                                                />
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category *</label>
                                            <div className="flex flex-wrap gap-2">
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat} type="button"
                                                        onClick={() => setForm({ ...form, category: cat })}
                                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.category === cat ? 'bg-primary text-white shadow-premium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Alert if no image for new product */}
                                        {!imagePreview && !editing && (
                                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
                                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                                <p className="text-xs font-bold">No image uploaded. Products display better with an image.</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-2">
                                            <button type="button" onClick={closeModal} className="flex-1 py-4 btn-secondary rounded-2xl">Cancel</button>
                                            <button type="submit" disabled={submitting} className="flex-1 py-4 btn-primary rounded-2xl flex items-center justify-center gap-2">
                                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> {editing ? 'Save Changes' : 'Create Product'}</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ProtectedRoute>
    );
};

export default AdminProductsPage;
