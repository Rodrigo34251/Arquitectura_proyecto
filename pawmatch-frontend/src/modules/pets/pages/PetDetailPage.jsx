import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockApi } from '../../../shared/services/api';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Heart, Loader2, CheckCircle, ShieldCheck, Home } from 'lucide-react';

export const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  //Respuestas del formulario de evaluación
  const [evaluation, setEvaluation] = useState({
    hasYard: false,
    otherPets: false,
    reason: ''
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await mockApi.getPetById(id);
        setPet(data);
      } catch (error) {
        navigate('/pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, navigate]);

  const handleAdoptionRequest = async (e) => {
    e.preventDefault(); // Evitamos que recargue la página
    setIsRequesting(true);
    setErrorMsg('');

    try {
      // Ahora enviamos la información de evaluación a la API
      await mockApi.createRequest(user.id, pet.id, evaluation);
      setRequestSuccess(true);
      setPet({ ...pet, status: 'En Proceso' }); 
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  if (loading) return <div className="text-center p-20 font-bold text-gray-500">Cargando detalles...</div>;
  if (!pet) return null;

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Link to="/pets" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver al catálogo
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        
        {/*Foto y Datos Médicos */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="h-80 lg:h-96 relative">
            <img src={`/images/pets/${pet.image}`} alt={pet.name} className="w-full h-full object-cover" />
          </div>
          
          {/* Tarjetas de información extra que agregamos */}
          <div className="p-6 bg-gray-50 grid grid-cols-2 gap-4 border-t border-gray-100">
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
              <ShieldCheck className={`w-8 h-8 ${pet.vaccinated ? 'text-green-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Vacunas</p>
                <p className="font-semibold text-gray-900">{pet.vaccinated ? 'Al día' : 'Pendiente'}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
              <Home className="w-8 h-8 text-indigo-500" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Tamaño</p>
                <p className="font-semibold text-gray-900">{pet.size}</p>
              </div>
            </div>
          </div>
        </div>

        {/*Información y Formulario */}
        <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900">{pet.name}</h1>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                pet.status === 'Disponible' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'
              }`}>
                {pet.status}
              </span>
            </div>
            
            <p className="text-lg text-gray-600 mb-2"><span className="font-semibold text-gray-800">Raza:</span> {pet.breed} • <span className="font-semibold text-gray-800">Edad:</span> {pet.age} años</p>
            <p className="text-gray-600 leading-relaxed mb-8 bg-primary-50 p-4 rounded-xl border border-primary-100 italic">
              "{pet.history}"
            </p>
          </div>

          {/* Zona de adopción */}
          <div className="mt-4 border-t border-gray-100 pt-6">
            {errorMsg && <p className="text-red-500 mb-4 font-medium text-sm">{errorMsg}</p>}
            
            {requestSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl flex items-center gap-4">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <p className="font-bold text-lg">¡Solicitud enviada para evaluación!</p>
                  <Link to="/user/dashboard" className="text-sm underline hover:text-green-800">Ver estado en mi perfil</Link>
                </div>
              </div>
            ) : pet.status !== 'Disponible' ? (
              <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-4 rounded-xl text-center text-lg font-medium">
                Esta mascota ya está en proceso de adopción
              </div>
            ) : !user ? (
              <button onClick={() => navigate('/login')} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl text-lg font-bold hover:bg-gray-200 transition border border-gray-300">
                Inicia sesión para postularte
              </button>
            ) : (
              // Formulario de evaluación para usuario logeado
              <form onSubmit={handleAdoptionRequest} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Formulario de Postulación</h3>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={evaluation.hasYard}
                      onChange={(e) => setEvaluation({...evaluation, hasYard: e.target.checked})}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" 
                    />
                    <span className="text-gray-700 font-medium">Cuento con patio o espacio abierto</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={evaluation.otherPets}
                      onChange={(e) => setEvaluation({...evaluation, otherPets: e.target.checked})}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" 
                    />
                    <span className="text-gray-700 font-medium">Tengo otras mascotas en casa</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Por qué quieres adoptar a {pet.name}?</label>
                    <textarea 
                      required
                      value={evaluation.reason}
                      onChange={(e) => setEvaluation({...evaluation, reason: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      rows="3"
                      placeholder="Cuéntanos un poco sobre ti..."
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isRequesting}
                  className="w-full bg-primary-600 text-white py-3.5 rounded-xl text-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                  {isRequesting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Heart className="w-6 h-6" />}
                  Enviar Postulación
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};