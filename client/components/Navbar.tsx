"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCount());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-soft py-3" : "bg-white/50 backdrop-blur-sm py-5"
      )}
    >
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
                  "text-sm font-semibold transition-colors hover:text-primary",
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? "text-primary"
                    : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all group">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 bg-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-white px-0.5"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 w-52 mt-2 py-2 bg-white rounded-2xl shadow-premium border border-gray-100 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{user.role}</p>
                      </div>
                      {user.role === 'ADMIN' ? (
                        <>
                          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                            <Settings className="w-4 h-4 text-primary" /> Admin Dashboard
                          </Link>
                          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                            <Package className="w-4 h-4 text-amber-500" /> Manage Products
                          </Link>
                          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                            <ShoppingCart className="w-4 h-4 text-blue-500" /> Manage Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4 text-primary" /> My Account
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium" onClick={() => setUserMenuOpen(false)}>
                            <Package className="w-4 h-4 text-amber-500" /> My Orders
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); logout(); }}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium rounded-b-2xl"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary py-2 px-5 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: cart + menu toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-0.5">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
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
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-soft"
          >
            <div className="flex flex-col gap-2 px-4 pt-2 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 text-sm font-semibold rounded-xl transition-all",
                    pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  {user.role === 'ADMIN' ? (
                    <>
                      <Link href="/admin/dashboard" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>
                        Admin Dashboard
                      </Link>
                      <Link href="/admin/products" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>
                        Manage Products
                      </Link>
                      <Link href="/admin/orders" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>
                        Manage Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/account" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>
                        My Account
                      </Link>
                      <Link href="/orders" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl" onClick={() => setIsOpen(false)}>
                        My Orders
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold rounded-xl flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl text-center" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-3 text-sm font-semibold text-white bg-primary rounded-xl text-center" onClick={() => setIsOpen(false)}>
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;