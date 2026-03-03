"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const CATEGORIES = ['EarPods', 'Watches', 'Scientific Calculators', 'Used PCs'];

const ShopContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    // Debounce search input by 500ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/products', {
                params: {
                    search: debouncedSearch || undefined,
                    category: category || undefined,
                    sortBy,
                    order,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                }
            });
            let prods: any[] = res.data.products;
            // Client-side price filter (as backup if backend doesn't support it)
            if (minPrice) prods = prods.filter((p: any) => p.price >= parseFloat(minPrice));
            if (maxPrice) prods = prods.filter((p: any) => p.price <= parseFloat(maxPrice));
            setProducts(prods);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, category, sortBy, order, minPrice, maxPrice]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const clearFilters = () => {
        setSearch('');
        setCategory('');
        setSortBy('createdAt');
        setOrder('desc');
        setMinPrice('');
        setMaxPrice('');
    };

    const hasFilters = search || category || minPrice || maxPrice || sortBy !== 'createdAt';

    return (
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Alpha Shop</h1>
                    <p className="text-gray-500 mt-1">
                        {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1 min-w-0 md:w-72">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`md:hidden flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm border transition-all ${filterOpen ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-100 shadow-soft'}`}
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>
            </div>

            {/* Active filters strip */}
            {hasFilters && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap items-center gap-2 mb-6">
                    {category && <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full">{category} <button onClick={() => setCategory('')} className="ml-1 hover:text-primary/70">×</button></span>}
                    {minPrice && <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Min ${minPrice} <button onClick={() => setMinPrice('')} className="ml-1">×</button></span>}
                    {maxPrice && <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">Max ${maxPrice} <button onClick={() => setMaxPrice('')} className="ml-1">×</button></span>}
                    <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-700 underline ml-1">Clear all</button>
                </motion.div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Filters Sidebar */}
                <AnimatePresence>
                    {(true) && (
                        <motion.aside
                            className={`${filterOpen ? 'block' : 'hidden'} md:block w-full lg:w-64 space-y-8 shrink-0`}
                        >
                            {/* Categories */}
                            <div className="bg-white p-6 rounded-[24px] shadow-soft border border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                    <Filter className="w-3.5 h-3.5" /> Categories
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setCategory('')}
                                        className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${!category ? 'bg-primary text-white shadow-premium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Categories
                                    </button>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat === category ? '' : cat)}
                                            className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${category === cat ? 'bg-primary text-white shadow-premium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="bg-white p-6 rounded-[24px] shadow-soft border border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                    <SlidersHorizontal className="w-3.5 h-3.5" /> Price Range
                                </h3>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                        <input
                                            type="number" placeholder="Min price"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
                                            min="0"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                                        <input
                                            type="number" placeholder="Max price"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/20"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="bg-white p-6 rounded-[24px] shadow-soft border border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Sort By</h3>
                                <select
                                    value={`${sortBy}-${order}`}
                                    onChange={(e) => {
                                        const [sb, o] = e.target.value.split('-');
                                        setSortBy(sb);
                                        setOrder(o);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                                >
                                    <option value="createdAt-desc">Newest First</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Product Grid */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-80" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map((p: any, i: number) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-bold">No products found</p>
                            <p className="text-gray-400 text-sm mt-2 mb-6">Try adjusting your search or filters</p>
                            <button onClick={clearFilters} className="btn-primary py-3 px-8 rounded-2xl inline-block">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShopPage = () => (
    <Suspense fallback={<div className="pt-40 text-center text-gray-400 font-medium">Loading shop...</div>}>
        <ShopContent />
    </Suspense>
);

export default ShopPage;
