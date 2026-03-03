import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-black text-primary tracking-tighter">ALPHA MARKET</Link>
                        <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                            Your ultimate destination for premium electronics and gadgets. We bring you the latest technology at the best prices.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Shop</h3>
                        <ul className="space-y-4">
                            <li><Link href="/shop" className="text-gray-500 hover:text-primary text-sm transition-colors">All Products</Link></li>
                            <li><Link href="/categories" className="text-gray-500 hover:text-primary text-sm transition-colors">Categories</Link></li>
                            <li><Link href="/shop?category=Watches" className="text-gray-500 hover:text-primary text-sm transition-colors">Featured Watches</Link></li>
                            <li><Link href="/shop?category=EarPods" className="text-gray-500 hover:text-primary text-sm transition-colors">Wireless Audio</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Return & Refund</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Newsletter</h3>
                        <p className="text-gray-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button className="bg-primary text-white p-2 rounded-xl hover:bg-indigo-700 transition-all">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-xs">
                        &copy; {new Date().getFullYear()} Alpha Market. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
