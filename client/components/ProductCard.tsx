"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border border-gray-100"
        >
            <div className="relative h-64 w-full overflow-hidden bg-gray-50">
                <Image
                    src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Link
                        href={`/shop/${product.id}`}
                        className="p-3 bg-white text-gray-900 rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                    <button className="p-3 bg-white text-gray-900 rounded-full hover:bg-secondary hover:text-white transition-all transform hover:scale-110">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <Link href={`/shop/${product.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-black text-gray-900">${product.price.toLocaleString()}</span>
                    <button className="text-sm font-bold text-primary hover:underline">
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
