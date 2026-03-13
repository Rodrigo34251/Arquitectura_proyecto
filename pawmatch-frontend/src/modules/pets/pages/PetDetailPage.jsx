import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import mascotaService from '../../../services/mascotaService';
import solicitudService from '../../../services/solicitudService';
import { useAuth } from '../../../hooks/useAuth';
import { ArrowLeft, Heart, Loader2, CheckCircle, Calendar, Info } from 'lucide-react';

export const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Comentarios del adoptante
  const [comentarios, setComentarios] = useState('');

  useEffect(() => {
    fetchPet();
  }, [id]);

  const fetchPet = async () => {
    try {
      setLoading(true);
      const response = await mascotaService.getById(id);
      setPet(response.data);
    } catch (error) {
      console.error('Error cargando mascota:', error);
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptionRequest = async (e) => {
    e.preventDefault();
    setIsRequesting(true);
    setErrorMsg('');

    try {
      await solicitudService.create({
        mascota_id: pet.id,
        comentarios_adoptante: comentarios,
      });

      setRequestSuccess(true);
      setPet({ ...pet, estado: 'EN_PROCESO' });
    } catch (error) {
      console.error('Error creando solicitud:', error);

      // Mensaje específico para admins
      if (error.response?.status === 403) {
        setErrorMsg('Los administradores no pueden crear solicitudes de adopción.');
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.mascota_id) {
          setErrorMsg(errors.mascota_id[0]);
        } else {
          setErrorMsg('Error de validación. Verifica los datos.');
        }
      } else {
        setErrorMsg(error.response?.data?.message || 'Error al enviar la solicitud');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Link
        to="/pets"
        className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver al catálogo
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

        {/* Foto */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="h-80 lg:h-96 relative">
            <img
              src={pet.foto_url || '/images/pets/default.jpg'}
              alt={pet.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/pets/default.jpg';
              }}
            />
          </div>

          {/* Información adicional */}
          <div className="p-6 bg-gray-50 grid grid-cols-2 gap-4 border-t border-gray-100">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
              <Info className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Especie</p>
                <p className="font-semibold text-gray-900">
                  {pet.especie === 'PERRO' ? 'Perro' : pet.especie === 'GATO' ? 'Gato' : 'Otro'}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Edad</p>
                <p className="font-semibold text-gray-900">
                  {pet.edad_aproximada ? `${Math.floor(pet.edad_aproximada / 12)} años` : 'Desconocida'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información y Formulario */}
        <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900">{pet.nombre}</h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${pet.estado === 'DISPONIBLE' ? 'bg-green-100 text-green-700' :
                pet.estado === 'ADOPTADA' ? 'bg-gray-100 text-gray-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                {pet.estado === 'DISPONIBLE' ? 'Disponible' :
                  pet.estado === 'ADOPTADA' ? 'Adoptada' :
                    pet.estado === 'EN_PROCESO' ? 'En Proceso' : 'Inactiva'}
              </span>
            </div>

            <p className="text-lg text-gray-600 mb-2">
              <span className="font-semibold text-gray-800">Raza:</span> {pet.raza || 'Mestizo'} •
              <span className="font-semibold text-gray-800"> Sexo:</span> {pet.sexo || 'No especificado'}
            </p>

            {pet.descripcion && (
              <p className="text-gray-600 leading-relaxed mb-8 bg-primary-50 p-4 rounded-xl border border-primary-100 italic">
                "{pet.descripcion}"
              </p>
            )}
          </div>

          {/* Zona de adopción */}
          <div className="mt-4 border-t border-gray-100 pt-6">
            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {errorMsg}
              </div>
            )}

            {requestSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl flex items-center gap-4">
                <CheckCircle className="w-8 h-8 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">¡Solicitud enviada!</p>
                  <p className="text-sm mt-1">
                    Recibirás un correo de confirmación. Puedes ver el estado de tu solicitud en tu perfil.
                  </p>
                  <Link
                    to="/user/dashboard"
                    className="text-sm underline hover:text-green-800 mt-2 inline-block"
                  >
                    Ver mis solicitudes
                  </Link>
                </div>
              </div>
            ) : pet.estado !== 'DISPONIBLE' ? (
              <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-4 rounded-xl text-center text-lg font-medium">
                Esta mascota {pet.estado === 'ADOPTADA' ? 'ya fue adoptada' : 'está en proceso de adopción'}
              </div>
            ) : !isAuthenticated() ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-primary-700 transition"
              >
                Inicia sesión para adoptar
              </button>
            ) : (
              <form onSubmit={handleAdoptionRequest} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Solicitud de Adopción
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Por qué quieres adoptar a {pet.nombre}?
                  </label>
                  <textarea
                    required
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    rows="4"
                    placeholder="Cuéntanos un poco sobre ti y por qué sería un buen hogar para esta mascota..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isRequesting}
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl text-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {isRequesting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-6 h-6" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};