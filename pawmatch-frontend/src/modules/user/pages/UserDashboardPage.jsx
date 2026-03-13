import { useEffect, useState } from 'react';
import solicitudService from '../../../services/solicitudService';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { User, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMySolicitudes();
  }, []);

  const fetchMySolicitudes = async () => {
    try {
      setLoading(true);
      const response = await solicitudService.getMySolicitudes();
      setSolicitudes(response.data);
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      setError('Error al cargar tus solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return {
          icon: Clock,
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          label: 'Pendiente',
        };
      case 'EN_REVISION':
        return {
          icon: Clock,
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          label: 'En Revisión',
        };
      case 'APROBADA':
        return {
          icon: CheckCircle,
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'Aprobada',
        };
      case 'RECHAZADA':
        return {
          icon: XCircle,
          bg: 'bg-red-100',
          text: 'text-red-700',
          label: 'Rechazada',
        };
      default:
        return {
          icon: Clock,
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: estado,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">

      {/* Saludo personalizado */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
        <div className="bg-primary-100 p-4 rounded-full text-primary-600">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.nombre}</h1>
          <p className="text-gray-500">Bienvenido a tu panel de adoptante</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Mis Solicitudes de Adopción
      </h2>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {solicitudes.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
              Aún no has solicitado adoptar a ningún peludito.
            </p>
            <Link
              to="/pets"
              className="text-primary-600 font-bold hover:underline"
            >
              Ir al catálogo de mascotas
            </Link>
          </div>
        ) : (
          solicitudes.map(solicitud => {
            const estadoConfig = getEstadoConfig(solicitud.estado);
            const IconoEstado = estadoConfig.icon;

            return (
              <div
                key={solicitud.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* Info de la mascota */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={solicitud.mascota?.foto_url || '/images/pets/default.jpg'}
                        alt={solicitud.mascota?.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/pets/default.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {solicitud.mascota?.nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {solicitud.mascota?.especie} • {solicitud.mascota?.raza || 'Mestizo'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Solicitado: {new Date(solicitud.created_at).toLocaleDateString('es-SV')}
                      </p>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${estadoConfig.bg} ${estadoConfig.text}`}>
                      <IconoEstado className="w-4 h-4" />
                      {estadoConfig.label}
                    </span>

                    {solicitud.motivo_rechazo && (
                      <p className="text-xs text-red-600 mt-2 max-w-xs">
                        Motivo: {solicitud.motivo_rechazo}
                      </p>
                    )}
                  </div>
                </div>

                {/* Comentarios */}
                {solicitud.comentarios_adoptante && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Tus comentarios:</span> {solicitud.comentarios_adoptante}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};