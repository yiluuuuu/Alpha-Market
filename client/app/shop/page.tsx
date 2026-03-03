"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import api from '@/lib/axios';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const categories = ['EarPods', 'Watches', 'Scientific Calculators', 'Used PCs'];

    useEffect(() => {
        fetchProducts();
    }, [category, sortBy, order]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products', {
                params: { search, category, sortBy, order }
            });
            setProducts(res.data.products);
        } catch (err) {
            console.error(err);
            // Fallback for static demo if backend is not ready
            setProducts([
                { id: '1', name: 'Apple-style Wireless EarPods', price: 1299, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'EarPods' },
                { id: '2', name: 'Smart Digital Watch', price: 2499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Watches' },
                { id: '3', name: 'Casio Scientific Calculator', price: 649, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500', category: 'Scientific Calculators' },
                { id: '4', name: 'Used Dell Desktop PC', price: 12999, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500', category: 'Used PCs' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Alpha Shop</h1>
                    <p className="text-gray-500 mt-2">Browse our collection of premium tech items.</p>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 space-y-10">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Categories
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setCategory('')}
                                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${!category ? 'bg-primary text-white shadow-premium' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${category === cat ? 'bg-primary text-white shadow-premium' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4" /> Sort By
                        </h3>
                        <select
                            value={`${sortBy}-${order}`}
                            onChange={(e) => {
                                const [sb, o] = e.target.value.split('-');
                                setSortBy(sb);
                                setOrder(o);
                            }}
                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-80" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((p: any) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg font-medium">No products found for this criteria.</p>
                            <button onClick={() => { setSearch(''); setCategory(''); }} className="mt-4 text-primary font-bold hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
