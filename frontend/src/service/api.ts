import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_fh');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token_fh');
            localStorage.removeItem('pengguna_fh');
            if (window.location.pathname.startsWith('/dashboard')) {
                window.location.href = '/masuk';
            }
        }
        return Promise.reject(error);
    }
);

export default api;