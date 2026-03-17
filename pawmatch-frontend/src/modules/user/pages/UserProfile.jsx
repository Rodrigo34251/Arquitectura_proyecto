import { useEffect, useState } from 'react';
import authService from '/src/services/authService';
import { User, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const UserProfile = () => {
  // 1. Cajas para guardar la información del perfil
  // Incluimos nombre, email, telefono y direccion como están en tu base de datos
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  
  // 2. Estados para controlar qué pasa en la pantalla
  const [loading, setLoading] = useState(true); // Para la carga inicial
  const [saving, setSaving] = useState(false);  // Para cuando damos clic en "Guardar"
  const [message, setMessage] = useState({ type: '', text: '' }); // Para los avisos de éxito o error

  // 3. Al entrar a la página, pedimos tus datos reales a Laravel
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await authService.me();
        const userData = response.data || response; 
        
        // Llenamos los cuadros con la información que nos mandó el servidor
        setFormData({
          nombre: userData.nombre || '', 
          email: userData.email || '',
          telefono: userData.telefono || '',
          direccion: userData.direccion || ''
        });
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'No pudimos cargar tu información.' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // 4. Función para guardar los cambios en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Preparamos solo los datos que Laravel permite editar (el email no se toca)
      const dataToUpdate = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion
      };

      await authService.updateProfile(dataToUpdate);
      setMessage({ type: 'success', text: '¡Tus datos se actualizaron correctamente!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Hubo un error al actualizar tus datos.' 
      });
    } finally {
      setSaving(false);
    }
  };

  // 5. Función que detecta cuando escribes en los cuadros de texto
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 6. Pantalla de carga mientras esperamos al servidor
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center font-bold text-gray-500 animate-pulse">
          Cargando tus datos...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* ENCABEZADO DEL PERFIL */}
        <div className="bg-primary-50 p-8 flex flex-col md:flex-row items-center gap-6 border-b border-gray-100 text-center md:text-left">
          <div className="bg-white p-6 rounded-full shadow-md text-primary-600 border-4 border-primary-100">
            <User className="w-16 h-16" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{formData.nombre || 'Mi Perfil'}</h1>
            <p className="text-gray-500 mt-1 font-medium">{formData.email}</p>
          </div>
        </div>

        {/* FORMULARIO DE EDICIÓN */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Información Personal</h2>

          {/* MENSAJES DE ÉXITO O ERROR */}
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Nombre */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>

            {/* Campo: Teléfono */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej. 7777-7777"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          {/* Campo: Dirección */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dirección Física</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Escribe tu dirección completa"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          {/* Campo: Correo (Solo lectura por seguridad) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">El correo electrónico no se puede modificar.</p>
          </div>

          {/* BOTÓN DE GUARDAR */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-sm text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 transition-all transform active:scale-[0.98]"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              {saving ? 'Guardando cambios...' : 'Guardar Perfil'}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};