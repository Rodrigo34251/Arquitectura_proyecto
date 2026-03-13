import api from './api';

const mascotaService = {
    // Listar mascotas
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.especie) params.append('especie', filters.especie);
        if (filters.sexo) params.append('sexo', filters.sexo);
        if (filters.search) params.append('search', filters.search);
        if (filters.per_page) params.append('per_page', filters.per_page);
        if (filters.page) params.append('page', filters.page);

        const response = await api.get(`/mascotas?${params.toString()}`);
        return response.data;
    },

    // Obtener una mascota por ID 
    getById: async (id) => {
        const response = await api.get(`/mascotas/${id}`);
        return response.data;
    },

    // Crear mascota 
    create: async (mascotaData) => {
        const formData = new FormData();

        Object.keys(mascotaData).forEach(key => {
            if (mascotaData[key] !== null && mascotaData[key] !== undefined) {
                if (key === 'foto' && mascotaData[key] instanceof File) {
                    formData.append('foto', mascotaData[key]);
                } else {
                    formData.append(key, mascotaData[key]);
                }
            }
        });

        const response = await api.post('/mascotas', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Actualizar mascota 
    update: async (id, mascotaData) => {
        const formData = new FormData();

        Object.keys(mascotaData).forEach(key => {
            if (mascotaData[key] !== null && mascotaData[key] !== undefined) {
                if (key === 'foto' && mascotaData[key] instanceof File) {
                    formData.append('foto', mascotaData[key]);
                } else {
                    formData.append(key, mascotaData[key]);
                }
            }
        });

        const response = await api.post(`/mascotas/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-HTTP-Method-Override': 'PUT', 
            },
        });
        return response.data;
    },

    // Eliminar mascota 
    delete: async (id) => {
        const response = await api.delete(`/mascotas/${id}`);
        return response.data;
    },

    // Listar mascotas eliminadas 
    getTrashed: async () => {
        const response = await api.get('/mascotas/trashed/list');
        return response.data;
    },

    // Restaurar mascota
    restore: async (id) => {
        const response = await api.post(`/mascotas/${id}/restore`);
        return response.data;
    },
};

export default mascotaService;