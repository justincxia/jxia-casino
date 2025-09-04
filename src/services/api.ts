import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export type User = {
    id: string;
    username: string;
    email: string;
    coins: number;
    gamesPlayed: number;
    totalWinnings: number;
    lastLogin?: string;
};

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateCoins: async (coins: number): Promise<{ message: string; user: User }> => {
        const response = await api.put('/auth/coins', { coins });
        return response.data;
    },

    topUpCoins: async (): Promise<{ message: string; user: User }> => {
        const response = await api.post('/auth/topup');
        return response.data;
    },
};

export default api;
