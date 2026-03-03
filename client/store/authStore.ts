import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => {
                localStorage.setItem('alpha_token', token);
                set({ user, token });
            },
            logout: () => {
                localStorage.removeItem('alpha_token');
                set({ user: null, token: null });
                window.location.href = '/auth/login';
            },
        }),
        { name: 'alpha-market-auth' }
    )
);
