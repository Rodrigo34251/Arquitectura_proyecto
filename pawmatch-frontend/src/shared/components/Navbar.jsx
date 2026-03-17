import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, PawPrint, Menu, X, FileText, User, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  // traemos isAdmin para saber si es el jefe o un usuario normal
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 relative z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* logo */}
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="text-primary-600 w-8 h-8" />
          <span className="text-2xl font-bold text-gray-900">
            Paw<span className="text-secondary-600">Match</span>
          </span>
        </Link>

        {/* boton hamburguesa para moviles */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* menu para pantallas grandes */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {isAuthenticated() ? (
            <div className="flex items-center gap-6">
              
              {/* logica para separar al admin del usuario normal */}
              {isAdmin() ? (
                // --- VISTA DEL ADMINISTRADOR (3 OPCIONES) ---
                <>
                  <Link to="/pets" className="hover:text-primary-600 transition flex items-center gap-1">
                    <PawPrint size={18} /> Mascotas
                  </Link>

                  <Link to="/admin/dashboard" className="hover:text-primary-600 transition flex items-center gap-1">
                    <LayoutDashboard size={18} /> Panel Admin
                  </Link>
                </>
              ) : (
                // --- VISTA DEL USUARIO NORMAL (3 OPCIONES + SALIR) ---
                <>
                  <Link to="/pets" className="hover:text-primary-600 transition flex items-center gap-1">
                    <PawPrint size={18} /> Mascotas
                  </Link>

                  <Link to="/user/dashboard" className="hover:text-primary-600 transition flex items-center gap-1">
                    <FileText size={18} /> Mis Solicitudes
                  </Link>

                  <Link to="/user/profile" className="hover:text-primary-600 transition flex items-center gap-1">
                    <User size={18} /> Mi Perfil
                  </Link>
                </>
              )}

              {/* el boton de salir es igual para ambos, lo ponemos al final */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition border-l pl-4 border-gray-200"
              >
                <LogOut size={20} /> Salir
              </button>
              
            </div>
          ) : (
            // opciones para visitantes sin sesion
            <div className="flex items-center gap-3">
              <Link to="/pets" className="hover:text-primary-600 transition mr-4">
                Catálogo
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* menu desplegable para moviles */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 text-center">
          {isAuthenticated() ? (
            <div className="flex flex-col gap-3">
              
              {/* logica movil para admin o usuario */}
              {isAdmin() ? (
                <>
                  <Link
                    to="/pets"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Mascotas
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Panel Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/pets"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Mascotas
                  </Link>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Mis Solicitudes
                  </Link>
                  <Link
                    to="/user/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Mi Perfil
                  </Link>
                </>
              )}

              {/* boton salir movil */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-3 rounded-lg font-bold mt-2"
              >
                <LogOut size={20} /> Salir
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/pets"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg"
              >
                Catálogo
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="border border-primary-600 text-primary-600 py-3 rounded-lg font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="bg-primary-600 text-white py-3 rounded-lg font-medium"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};