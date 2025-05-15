// api.js atau authApi.js

import axios from 'axios';

// Buat instance axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tambahkan interceptor untuk menyisipkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// API wrapper
export const AuthApi = {
    client: () => api,

    login: async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            return response;
        } catch (error) {
            return error?.response?.data || {
                success: false,
                message: 'Login failed',
            };
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data.success;
        } catch (error) {
            return false;
        }
    },

    checkAuth: async () => {
        try {
            const response = await api.post('/auth/validate-token');
            return response.data.success;
        } catch (error) {
            console.error("Error during token validation:", error);
            return false;
        }
    }
};
