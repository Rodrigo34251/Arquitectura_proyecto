import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import mascotaService from '../../../services/mascotaService';
import solicitudService from '../../../services/solicitudService';
import {
  PawPrint,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  FileText,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();

  // Estados
  const [activeTab, setActiveTab] = useState('solicitudes');
  const [mascotas, setMascotas] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sistema de notificaciones (Toast)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Modal de crear/editar mascota
  const [showMascotaModal, setShowMascotaModal] = useState(false);
  const [editingMascota, setEditingMascota] = useState(null);

  // Modal de confirmar eliminación
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [mascotaToDelete, setMascotaToDelete] = useState(null);

  // Modal de rechazar solicitud
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [solicitudToReject, setSolicitudToReject] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  // Modal de ver detalle de solicitud
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Modal de confirmar aprobación
  const [showConfirmAprobarModal, setShowConfirmAprobarModal] = useState(false);
  const [solicitudToApprove, setSolicitudToApprove] = useState(null);

  useEffect(() => {
    if (activeTab === 'mascotas') {
      fetchMascotas();
    } else {
      fetchSolicitudes();
    }
  }, [activeTab]);

  const fetchMascotas = async () => {
    try {
      setLoading(true);
      const response = await mascotaService.getAll();
      setMascotas(response.data);
    } catch (err) {
      console.error('Error al cargar mascotas:', err);
      showNotification('Error al cargar mascotas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await solicitudService.getAll({ estado: 'PENDIENTE' });
      setSolicitudes(response.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setSolicitudes([]);
      } else {
        console.error('Error cargando solicitudes:', err);
        setSolicitudes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (mascota) => {
    setMascotaToDelete(mascota);
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteMascota = async () => {
    if (!mascotaToDelete) return;
    
    setShowConfirmDeleteModal(false);
    try {
      await mascotaService.delete(mascotaToDelete.id);
      fetchMascotas();
      showNotification('Mascota eliminada', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error al eliminar mascota', 'error');
    } finally {
      setMascotaToDelete(null);
    }
  };

  const handleAprobarClick = (solicitud) => {
    setSolicitudToApprove(solicitud);
    setShowConfirmAprobarModal(true);
  };

  const confirmAprobarSolicitud = async () => {
    if (!solicitudToApprove) return;
    
    setShowConfirmAprobarModal(false);
    setSelectedRequest(null);
    setLoading(true);

    try {
      await solicitudService.aprobar(solicitudToApprove.id);
      fetchSolicitudes();
      showNotification('Solicitud aprobada exitosamente', 'success'); 
    } catch (err) {
      console.error(err);
      showNotification('Error al aprobar solicitud', 'error');
    } finally {
      setLoading(false);
      setSolicitudToApprove(null);
    }
  };

  const handleRechazarClick = (solicitud) => {
    setSolicitudToReject(solicitud.id);
    setSelectedRequest(null);
    setShowRechazoModal(true);
  };

  const handleRechazarSolicitud = async () => {
    if (!motivoRechazo.trim()) {
      showNotification('Debes ingresar un motivo de rechazo', 'error');
      return;
    }

    try {
      await solicitudService.rechazar(solicitudToReject, motivoRechazo);
      setShowRechazoModal(false);
      setSolicitudToReject(null);
      setMotivoRechazo('');
      fetchSolicitudes();
      showNotification('Solicitud rechazada', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error al rechazar solicitud', 'error');
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl relative">

      {/* Toast Notificación */}
      {notification.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl font-bold text-white flex items-center gap-3 z-[100] transition-all transform duration-300 ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500">Bienvenido, {user?.nombre}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('solicitudes')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'solicitudes'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          <FileText className="w-5 h-5" />
          Solicitudes Pendientes
        </button>

        <button
          onClick={() => setActiveTab('mascotas')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${activeTab === 'mascotas'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
        >
          <PawPrint className="w-5 h-5" />
          Gestión de Mascotas
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : activeTab === 'solicitudes' ? (
        <SolicitudesTab
          solicitudes={solicitudes}
          onVerDetalle={setSelectedRequest}
        />
      ) : (
        <MascotasTab
          mascotas={mascotas}
          onDelete={handleDeleteClick}
          onEdit={(m) => { setEditingMascota(m); setShowMascotaModal(true); }}
          onAdd={() => { setEditingMascota(null); setShowMascotaModal(true); }}
        />
      )}

      {/* Modal Detalle Solicitud */}
      {selectedRequest && (
        <DetalleModal
          solicitud={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAprobar={() => handleAprobarClick(selectedRequest)} 
          onRechazar={() => handleRechazarClick(selectedRequest)}
        />
      )}

      {/* Modal Confirmar Aprobación */}
      {showConfirmAprobarModal && (
        <ConfirmAprobarModal
          solicitud={solicitudToApprove}
          onConfirm={confirmAprobarSolicitud}
          onCancel={() => { setShowConfirmAprobarModal(false); setSolicitudToApprove(null); }}
        />
      )}

      {/* Modal Rechazar Solicitud */}
      {showRechazoModal && (
        <RechazoModal
          motivo={motivoRechazo}
          setMotivo={setMotivoRechazo}
          onConfirm={handleRechazarSolicitud}
          onCancel={() => { setShowRechazoModal(false); setSolicitudToReject(null); setMotivoRechazo(''); }}
        />
      )}

      {/* Modal Crear/Editar Mascota */}
      {showMascotaModal && (
        <MascotaModal
          mascota={editingMascota}
          onClose={() => { setShowMascotaModal(false); setEditingMascota(null); }}
          onSuccess={() => { 
            setShowMascotaModal(false); 
            fetchMascotas();
            showNotification(editingMascota ? 'Mascota actualizada' : 'Mascota creada', 'success');
          }}
          onError={(msg) => showNotification(msg, 'error')}
        />
      )}

      {/* Modal Confirmar Eliminación */}
      {showConfirmDeleteModal && (
        <ConfirmDeleteModal
          mascota={mascotaToDelete}
          onConfirm={confirmDeleteMascota}
          onCancel={() => { setShowConfirmDeleteModal(false); setMascotaToDelete(null); }}
        />
      )}
    </div>
  );
};

// Componente: Tab de Solicitudes
const SolicitudesTab = ({ solicitudes, onVerDetalle }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-yellow-500" />
        Solicitudes Pendientes
      </h2>

      {solicitudes.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No hay solicitudes pendientes.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Adoptante</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Mascota</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {solicitudes.map(solicitud => (
                <tr key={solicitud.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{solicitud.adoptante?.nombre}</p>
                      <p className="text-sm text-gray-500">{solicitud.adoptante?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{solicitud.mascota?.nombre}</p>
                    <p className="text-sm text-gray-500">{solicitud.mascota?.especie}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(solicitud.created_at).toLocaleDateString('es-SV')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      Pendiente
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onVerDetalle(solicitud)}
                      className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Componente: Tab de Mascotas (FILTROS ELIMINADOS)
const MascotasTab = ({ mascotas, onDelete, onEdit, onAdd }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Mascotas Registradas</h2>
        
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition font-semibold w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Agregar Mascota
        </button>
      </div>

      {mascotas.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl border border-dashed border-gray-300">
          <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay mascotas registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascotas.map(mascota => (
            <div key={mascota.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${mascota.estado === 'INACTIVA' ? 'opacity-70 border-red-200' : 'border-gray-100'}`}>
              <div className="h-48 relative">
                <img
                  src={mascota.foto_url || '/images/pets/default.jpg'}
                  alt={mascota.nombre}
                  className={`w-full h-full object-cover ${mascota.estado === 'INACTIVA' ? 'grayscale' : ''}`}
                  onError={(e) => { e.target.src = '/images/pets/default.jpg'; }}
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    mascota.estado === 'DISPONIBLE' ? 'bg-green-500 text-white' :
                    mascota.estado === 'ADOPTADA' ? 'bg-blue-500 text-white' :
                    mascota.estado === 'INACTIVA' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                  {mascota.estado}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">{mascota.nombre}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {mascota.especie} • {mascota.raza || 'Mestizo'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(mascota)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    <Edit2 className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => onDelete(mascota)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Modal: Ver Detalle de Solicitud
const DetalleModal = ({ solicitud, onClose, onAprobar, onRechazar }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
          <X className="w-7 h-7" />
        </button>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Detalles de la Solicitud</h2>
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
          <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
            <p className="text-sm text-gray-500">Adoptante: <br/><span className="text-lg font-bold text-gray-900">{solicitud.adoptante?.nombre || 'Usuario'}</span></p>
            <p className="text-sm text-gray-500 text-right">Mascota: <br/><span className="text-lg font-bold text-primary-600">{solicitud.mascota?.nombre || 'Mascota'}</span></p>
          </div>
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Información de Contacto:</h3>
          <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">Correo Electrónico</span>
              <span className="text-gray-800 font-medium">{solicitud.adoptante?.email || 'No registrado'}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">Teléfono</span>
              <span className="text-gray-800 font-medium">{solicitud.adoptante?.telefono || 'No registrado'}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase">Dirección Física</span>
              <span className="text-gray-800 font-medium">{solicitud.adoptante?.direccion || 'No registrada'}</span>
            </div>
          </div>
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Detalles de la Postulación:</h3>
          <ul className="space-y-4">
            <li className="mt-4">
              <span className="block text-sm font-bold text-gray-700 mb-2">Motivo y comentarios adicionales:</span>
              <div className="text-gray-600 italic bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                "{solicitud.comentarios_adoptante || solicitud.motivo || 'El adoptante no proporcionó comentarios adicionales.'}"
              </div>
            </li>
          </ul>
        </div>
        {solicitud.estado === 'PENDIENTE' ? (
          <div className="flex gap-4">
            <button onClick={onAprobar} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-lg">
              <CheckCircle className="w-6 h-6" /> Aprobar
            </button>
            <button onClick={onRechazar} className="flex-1 bg-red-100 text-red-700 py-4 rounded-xl font-bold text-lg hover:bg-red-200 transition flex justify-center items-center gap-2">
              <XCircle className="w-6 h-6" /> Rechazar
            </button>
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-xl text-gray-500 font-bold border border-gray-200">
            Esta solicitud ya fue procesada y marcada como {solicitud.estado?.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal: Confirmar Aprobación
const ConfirmAprobarModal = ({ solicitud, onConfirm, onCancel }) => {
  if (!solicitud) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirmar Aprobación</h3>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          Estás a punto de <strong className="text-green-700">aprobar</strong> la solicitud para <strong className="text-primary-600">{solicitud.mascota?.nombre}</strong>.
          <br /><br />
          ¿Estás completamente seguro de continuar?
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
            No, cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex justify-center items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Sí, aprobar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal: Confirmar Eliminación
const ConfirmDeleteModal = ({ mascota, onConfirm, onCancel }) => {
  if (!mascota) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Eliminar Mascota</h3>
        </div>
        <p className="text-gray-700 leading-relaxed mb-6">
          ¿Estás seguro que deseas eliminar o marcar como inactiva a <strong className="text-primary-600">{mascota.nombre}</strong>?
          <br /><br />
          Esta acción removerá a la mascota del catálogo público.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-bold flex justify-center items-center gap-2">
            <Trash2 className="w-5 h-5" /> Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal: Rechazar Solicitud
const RechazoModal = ({ motivo, setMotivo, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Rechazar Solicitud</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo del rechazo *</label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 outline-none"
          rows="4"
          placeholder="Explica el motivo del rechazo para notificar al adoptante..."
        ></textarea>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium">Confirmar Rechazo</button>
        </div>
      </div>
    </div>
  );
};

// Modal: Crear/Editar Mascota
const MascotaModal = ({ mascota, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    nombre: mascota?.nombre || '',
    especie: mascota?.especie || 'PERRO',
    raza: mascota?.raza || '',
    edad_aproximada: mascota?.edad_aproximada || '',
    sexo: mascota?.sexo || 'MACHO',
    descripcion: mascota?.descripcion || '',
    estado: mascota?.estado || 'DISPONIBLE',
  });
  
  const [foto, setFoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = { ...formData };
      if (foto) data.foto = foto;
      if (mascota) {
        await mascotaService.update(mascota.id, data);
      } else {
        await mascotaService.create(data);
      }
      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      onError('Error al guardar la mascota');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{mascota ? 'Editar Mascota' : 'Agregar Mascota'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label><input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especie *</label>
              <select name="especie" required value={formData.especie} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="PERRO">Perro</option><option value="GATO">Gato</option><option value="OTRO">Otro</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Raza</label><input type="text" name="raza" value={formData.raza} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Ej: Golden Retriever" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Edad (meses)</label><input type="number" name="edad_aproximada" min="0" value={formData.edad_aproximada} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="MACHO">Macho</option><option value="HEMBRA">Hembra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                <option value="DISPONIBLE">Disponible</option><option value="EN_PROCESO">En Proceso</option><option value="ADOPTADA">Adoptada</option><option value="INACTIVA">Inactiva</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="Describe a la mascota..."></textarea></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto {!mascota && '*'}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
            {mascota && !foto && <p className="text-sm text-gray-500 mt-1">Deja vacío para mantener la foto actual</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-70">{isSubmitting ? 'Guardando...' : (mascota ? 'Actualizar' : 'Crear')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};