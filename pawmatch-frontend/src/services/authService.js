import api from "./api";

const authService = {
    // Registro
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Logout
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Obtener usuario actual
    me: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Actualizar perfil
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (resetData) => {
        const response = await api.post('/auth/reset-password', resetData);
        return response.data;
    },

    // Obtener usuario de localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Verificar si está autenticado
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Verificar si es admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.rol === 'ADMINISTRADOR';
    },
};

export default authService;