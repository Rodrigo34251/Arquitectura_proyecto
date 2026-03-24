import api from './api';

const solicitudService = {
    // Crear solicitud
    create: async (solicitudData) => {
        const response = await api.post('/solicitudes', solicitudData);
        return response.data;
    },

    // Ver mis solicitudes
    getMySolicitudes: async (page = 1) => {
        const response = await api.get(`/solicitudes/mis-solicitudes?page=${page}`);
        return response.data;
    },

    // Ver detalle de una solicitud
    getById: async (id) => {
        const response = await api.get(`/solicitudes/${id}`);
        return response.data;
    },

    // Listar todas las solicitudes 
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.estado) params.append('estado', filters.estado);
        if (filters.page) params.append('page', filters.page);

        const response = await api.get(`/solicitudes?${params.toString()}`);
        return response.data;
    },

    // Aprobar solicitud 
    aprobar: async (id) => {
        const response = await api.post(`/solicitudes/${id}/aprobar`);
        return response.data;
    },

    // Rechazar solicitud 
    rechazar: async (id, motivoRechazo) => {
        const response = await api.post(`/solicitudes/${id}/rechazar`, {
            motivo_rechazo: motivoRechazo,
        });
        return response.data;
    },

    // Ver historial de cambios
    getHistorial: async (id) => {
        const response = await api.get(`/solicitudes/${id}/historial`);
        return response.data;
    },
};

export default solicitudService;