"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop', href: '/shop' },
        { name: 'Categories', href: '/categories' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            isScrolled ? "bg-white/80 backdrop-blur-md shadow-soft py-3" : "bg-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-3xl font-black text-primary tracking-tighter">ALPHA MARKET</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-gray-600"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-5">
                        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">0</span>
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-all">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-xl shadow-premium border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <Link href={user.role === 'ADMIN' ? "/admin/dashboard" : "/orders"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Profile & Orders'}
                                    </Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="btn-primary py-2 px-5 text-sm">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <Link href="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!user && (
                                <Link
                                    href="/auth/login"
                                    className="block px-3 py-4 text-base font-medium text-primary hover:bg-primary/5 rounded-xl text-center border-2 border-primary mt-4"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
