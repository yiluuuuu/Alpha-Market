import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://alpha-market-production.up.railway.app/api',
    withCredentials: true,
});
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
// Interceptor for JWT
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('alpha_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
