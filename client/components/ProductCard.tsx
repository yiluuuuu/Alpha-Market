"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock?: number;
    description?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);
    const isInCart = cartItems.some((i) => i.id === product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check stock
        const existingItem = cartItems.find((i) => i.id === product.id);
        const currentQty = existingItem ? existingItem.quantity : 0;
        const stock = product.stock ?? 99;

        if (currentQty >= stock) {
            toast.error('Maximum stock reached!');
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: stock,
        });
        toast.success(`${product.name.slice(0, 20)}... added to cart!`, {
            icon: '🛒',
            style: { fontWeight: 600 },
        });
    };

    const imageUrl = product.image?.startsWith('/')
        ? `http://localhost:5000${product.image}`
        : product.image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border border-gray-100"
        >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={imageUrl?.startsWith('http://localhost')}
                />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Link
                        href={`/shop/${product.id}`}
                        className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-110 shadow-md"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        className={`p-3 rounded-full transition-all transform hover:scale-110 shadow-md ${isInCart
                                ? 'bg-secondary text-white'
                                : 'bg-white text-gray-900 hover:bg-secondary hover:text-white'
                            }`}
                    >
                        {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </button>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {product.category}
                    </span>
                </div>

                {/* Out of stock badge */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-sm font-black text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200 uppercase tracking-widest">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-6">
                <Link href={`/shop/${product.id}`}>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                {product.description && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{product.description}</p>
                )}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-black text-gray-900">${product.price.toLocaleString()}</span>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`text-sm font-bold px-4 py-2 rounded-xl transition-all active:scale-95 ${product.stock === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : isInCart
                                    ? 'text-secondary bg-secondary/5 hover:bg-secondary/10'
                                    : 'text-primary hover:bg-primary/5'
                            }`}
                    >
                        {isInCart ? '✓ In Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
