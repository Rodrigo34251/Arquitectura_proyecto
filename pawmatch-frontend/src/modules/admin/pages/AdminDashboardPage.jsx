import { useEffect, useState } from 'react';
import { mockApi } from '../../../shared/services/api';
import { CheckCircle, XCircle, Clock, ShieldCheck, Eye, X } from 'lucide-react'; 

export const AdminDashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await mockApi.getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error cargando solicitudes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setProcessingId(requestId);
    try {
      await mockApi.updateRequestStatus(requestId, newStatus);
      await fetchRequests(); // Recargamos la tabla
      
      // Si el modal está abierto, lo cerramos automáticamente
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(null);
      }
    } catch (error) {
      alert("Hubo un error al actualizar la solicitud");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="text-center p-20 text-xl font-bold text-gray-500">Cargando panel de administración...</div>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl relative">
      
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
        <ShieldCheck className="w-10 h-10 text-primary-600" />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Evalúa las solicitudes de adopción detalladamente.</p>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary-500" /> Solicitudes Pendientes
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Adoptante</th>
                <th className="p-4 font-semibold">Mascota</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No hay solicitudes pendientes.</td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{req.userName}</td>
                    <td className="p-4 text-primary-600 font-semibold">{req.petName}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(req.date).toLocaleDateString()}</td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Pendiente' ? 'bg-secondary-100 text-secondary-700' :
                        req.status === 'Aprobada' ? 'bg-primary-100 text-primary-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    
                    <td className="p-4 text-right">
                      {/* Botón para ver detalles */}
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition font-bold text-sm flex items-center gap-2 ml-auto"
                      >
                        <Eye className="w-4 h-4" /> Ver Postulación
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative border border-gray-100">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => setSelectedRequest(null)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Detalles del Postulante</h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
              <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm text-gray-500">Adoptante: <br/><span className="text-lg font-bold text-gray-900">{selectedRequest.userName}</span></p>
                <p className="text-sm text-gray-500 text-right">Mascota: <br/><span className="text-lg font-bold text-primary-600">{selectedRequest.petName}</span></p>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Respuestas del Cuestionario:</h3>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  {selectedRequest.evaluation?.hasYard ? <CheckCircle className="text-green-500 w-6 h-6"/> : <XCircle className="text-red-500 w-6 h-6"/>}
                  <span className="text-gray-700 font-medium">¿Cuenta con patio o espacio abierto?</span>
                </li>
                <li className="flex items-center gap-3">
                  {selectedRequest.evaluation?.otherPets ? <CheckCircle className="text-green-500 w-6 h-6"/> : <XCircle className="text-red-500 w-6 h-6"/>}
                  <span className="text-gray-700 font-medium">¿Tiene otras mascotas en casa?</span>
                </li>
                <li className="mt-4">
                  <span className="block text-sm font-bold text-gray-700 mb-2">Motivo de adopción:</span>
                  <div className="text-gray-600 italic bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                    "{selectedRequest.evaluation?.reason || 'El usuario no especificó un motivo.'}"
                  </div>
                </li>
              </ul>
            </div>

            {/* botones de decisión solo si está pendiente*/}
            {selectedRequest.status === 'Pendiente' ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => handleStatusChange(selectedRequest.id, 'Aprobada')}
                  disabled={processingId === selectedRequest.id}
                  className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
                >
                  <CheckCircle className="w-6 h-6" /> Aprobar
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedRequest.id, 'Rechazada')}
                  disabled={processingId === selectedRequest.id}
                  className="flex-1 bg-red-100 text-red-700 py-4 rounded-xl font-bold text-lg hover:bg-red-200 transition flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  <XCircle className="w-6 h-6" /> Rechazar
                </button>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-100 rounded-xl text-gray-500 font-bold border border-gray-200">
                Esta solicitud ya fue marcada como {selectedRequest.status.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};