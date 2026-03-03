"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('ADMIN' | 'CUSTOMER')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
            return;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            if (user.role === 'ADMIN') router.push('/admin/dashboard');
            else router.push('/shop');
        }
    }, [user, token, router, allowedRoles]);

    if (!token) return null;
    if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

    return <>{children}</>;
};

export default ProtectedRoute;
