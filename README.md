# PawMatch — Sistema de Adopción de Mascotas

**PawMatch** es una plataforma fullstack para la gestión de adopción de mascotas. Conecta a adoptantes con animales en busca de un hogar, gestionando el proceso completo de solicitud, revisión y aprobación de adopciones, con notificaciones automáticas por correo electrónico.

---

## 📁 Estructura del Repositorio

```
Arquitectura_proyecto/
├── pawmatch-api/         # Backend — Laravel 12 (REST API)
└── pawmatch-frontend/    # Frontend — React 19 + Vite + TailwindCSS
```

---

## 🛠️ Stack Tecnológico

### Backend (`pawmatch-api`)
| Tecnología | Versión | Uso |
|---|---|---|
| PHP | ^8.2 | Lenguaje base |
| Laravel | ^12.0 | Framework principal |
| Laravel Sanctum | ^4.0 | Autenticación por tokens Bearer |
| Spatie Laravel Permission | ^7.2 | Sistema de roles y permisos |
| Dedoc Scramble | ^0.13.14 | Documentación automática de la API |
| SQLite | — | Base de datos (desarrollo) |
| Pest PHP | ^3.8 | Framework de pruebas |

### Frontend (`pawmatch-frontend`)
| Tecnología | Versión | Uso |
|---|---|---|
| React | ^19.2.0 | Framework de UI |
| Vite | ^7.3.1 | Bundler y dev server |
| React Router DOM | ^7.13.1 | Enrutamiento SPA |
| TailwindCSS | ^3.4.19 | Estilos CSS utilitarios |
| Axios | ^1.13.6 | Cliente HTTP |
| Lucide React | ^0.576.0 | Íconos |

---

## 🏗️ Arquitectura del Backend

El backend sigue una **arquitectura modular por dominio** (inspirada en Clean Architecture), separando las responsabilidades en capas bien definidas dentro de cada módulo.

```
app/
├── Models/                     # Modelos Eloquent globales
│   ├── User.php
│   ├── Mascota.php
│   ├── SolicitudAdopcion.php
│   ├── HistorialEstadoSolicitud.php
│   └── NotificacionCorreo.php
│
├── Modules/                    # Módulos de dominio
│   ├── Auth/
│   │   ├── Controllers/        # AuthController
│   │   ├── DTOs/               # LoginUserDTO, RegisterUserDTO, etc.
│   │   ├── Domain/             # Lógica de dominio
│   │   ├── Repositories/       # Acceso a datos
│   │   └── UseCases/           # Casos de uso (Register, Login, etc.)
│   │
│   ├── Mascotas/
│   │   ├── Controllers/        # MascotaController
│   │   ├── DTOs/               # CreateMascotaDTO, UpdateMascotaDTO, etc.
│   │   ├── Domain/
│   │   ├── Repositories/
│   │   └── UseCases/           # CRUD + Soft delete + Restore
│   │
│   ├── Solicitudes/
│   │   ├── Controllers/        # SolicitudController
│   │   ├── DTOs/               # CreateSolicitudDTO
│   │   ├── Domain/
│   │   ├── Repositories/       # SolicitudRepository, HistorialRepository, etc.
│   │   └── UseCases/           # Crear, Aprobar, Rechazar, Historial, etc.
│   │
│   └── Adoptantes/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Domain/
│       ├── Repositories/
│       └── UseCases/
│
├── Policies/
│   ├── MascotaPolicy.php
│   └── SolicitudAdopcionPolicy.php
│
├── Services/
│   └── EmailService.php        # Envío de notificaciones por correo
│
└── Mail/                       # Mailables de Laravel
    ├── SolicitudCreadaMail.php
    ├── SolicitudAprobadaMail.php
    └── SolicitudRechazadaMail.php
```

Cada módulo sigue el patrón **Controller → UseCase → Repository**, con DTOs para encapsular y validar los datos entre capas.

---

## 🗄️ Modelos y Base de Datos

### `users`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Clave primaria |
| `nombre` | string | Nombre del usuario |
| `email` | string | Correo electrónico (único) |
| `password` | string | Contraseña hasheada (bcrypt) |
| `telefono` | string (nullable) | Teléfono de contacto |
| `direccion` | string (nullable) | Dirección del usuario |
| `rol` | enum | `USUARIO` o `ADMINISTRADOR` |
| `deleted_at` | timestamp (nullable) | Soft delete |

### `mascotas`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Clave primaria |
| `nombre` | string | Nombre de la mascota |
| `especie` | enum | `PERRO`, `GATO`, `OTRO` |
| `raza` | string (nullable) | Raza |
| `edad_aproximada` | integer (nullable) | Edad en meses |
| `sexo` | enum (nullable) | `MACHO`, `HEMBRA` |
| `descripcion` | text (nullable) | Descripción libre |
| `foto` | string (nullable) | Path relativo en storage |
| `estado` | enum | `DISPONIBLE`, `EN_PROCESO`, `ADOPTADA`, `INACTIVA` |
| `deleted_at` | timestamp (nullable) | Soft delete |

> **Nota:** El atributo virtual `foto_url` es generado automáticamente por el modelo y devuelve la URL completa de la imagen.

### `solicitudes_adopcion`
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | integer | Clave primaria |
| `user_id` | FK → users | Usuario adoptante |
| `mascota_id` | FK → mascotas | Mascota solicitada |
| `estado` | enum | `PENDIENTE`, `EN_REVISION`, `APROBADA`, `RECHAZADA`, `CANCELADA` |
| `comentarios_adoptante` | text (nullable) | Mensaje del adoptante |
| `motivo_rechazo` | text (nullable) | Razón del rechazo |
| `deleted_at` | timestamp (nullable) | Soft delete |

> **Restricción única:** Un usuario no puede tener más de una solicitud activa por mascota (`unique_active_solicitud`).

### `historial_estado_solicitud`
Registra cada cambio de estado de una solicitud (quién lo hizo, cuándo, estado anterior y nuevo).

### `notificaciones_correo`
Registra el estado de cada notificación de email enviada (`PENDIENTE`, `ENVIADA`, `FALLIDA`).

---

## 🔐 Autenticación y Roles

La autenticación usa **Laravel Sanctum** con tokens Bearer. Los roles se manejan con un campo `rol` directamente en el modelo `User`.

| Rol | Puede crear mascotas | Puede crear solicitudes | Puede aprobar/rechazar |
|---|---|---|---|
| `USUARIO` | ❌ | ✅ | ❌ |
| `ADMINISTRADOR` | ✅ | ❌ | ✅ |

Las reglas se aplican a través de **Policies** de Laravel:
- `MascotaPolicy` — controla creación, edición y eliminación de mascotas
- `SolicitudAdopcionPolicy` — controla creación, visualización y gestión de solicitudes

---

## 📡 API Endpoints

**URL base:** `http://localhost:8000/api`

### 🔓 Autenticación (públicas)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registrar nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión (retorna token) |
| `POST` | `/auth/forgot-password` | Solicitar restablecimiento de contraseña |
| `POST` | `/auth/reset-password` | Restablecer contraseña con token |

### 🔓 Mascotas (públicas)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/mascotas` | Listar mascotas (con filtros) |
| `GET` | `/mascotas/{id}` | Ver detalle de una mascota |

**Filtros disponibles para `GET /mascotas`:**
- `especie` → `PERRO`, `GATO`, `OTRO`
- `estado` → `DISPONIBLE`, `EN_PROCESO`, `ADOPTADA`, `INACTIVA`
- `sexo` → `MACHO`, `HEMBRA`
- `search` → búsqueda por texto (nombre/descripción)
- `per_page` → paginación (1–100)

### 🔐 Autenticación (protegidas — requieren token Bearer)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/logout` | Cerrar sesión (invalida token actual) |
| `GET` | `/auth/me` | Ver perfil del usuario autenticado |
| `PUT` | `/auth/profile` | Actualizar perfil (nombre, teléfono, dirección) |

### 🔐 Mascotas (solo ADMINISTRADOR)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/mascotas` | Crear mascota (soporta subida de foto) |
| `PUT` | `/mascotas/{id}` | Actualizar mascota (reemplaza foto si se envía) |
| `DELETE` | `/mascotas/{id}` | Eliminar mascota (soft delete) |
| `GET` | `/mascotas/trashed/list` | Listar mascotas eliminadas |
| `POST` | `/mascotas/{id}/restore` | Restaurar mascota eliminada |

### 🔐 Solicitudes (USUARIO autenticado)
| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/solicitudes` | Crear solicitud de adopción |
| `GET` | `/solicitudes/mis-solicitudes` | Ver mis solicitudes |
| `GET` | `/solicitudes/{id}` | Ver detalle de una solicitud propia |
| `GET` | `/solicitudes/{id}/historial` | Ver historial de cambios de estado |

### 🔐 Solicitudes (solo ADMINISTRADOR)
| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/solicitudes` | Listar todas las solicitudes (filtro por estado) |
| `POST` | `/solicitudes/{id}/aprobar` | Aprobar una solicitud |
| `POST` | `/solicitudes/{id}/rechazar` | Rechazar una solicitud (requiere `motivo_rechazo`) |

---

## ⚡ Lógica de Negocio Importante

### Proceso de Aprobación de Solicitud
Al aprobar una solicitud, el sistema automáticamente:
1. Cambia el estado de la solicitud a `APROBADA`
2. Registra el cambio en el historial con el ID del admin
3. Cambia el estado de la mascota a `ADOPTADA`
4. **Rechaza automáticamente** todas las demás solicitudes pendientes o en revisión para esa mascota
5. Envía notificaciones por correo al adoptante aprobado y a los rechazados

### Rate Limiting (Throttle)
Las rutas públicas sensibles tienen límite de peticiones configurado:
- `POST /auth/register` → throttle:register
- `POST /auth/login` → throttle:login
- `POST /auth/forgot-password` → throttle:forgot-password

### Notificaciones de Correo
El `EmailService` gestiona tres tipos de emails:
- **Solicitud creada:** confirmación al adoptante
- **Solicitud aprobada:** notificación de aprobación
- **Solicitud rechazada:** notificación de rechazo con motivo

Cada envío se registra en la tabla `notificaciones_correo` con su estado (`PENDIENTE` → `ENVIADA` o `FALLIDA`).

---

## 🖥️ Arquitectura del Frontend

El frontend es una **SPA (Single Page Application)** con React 19 y enrutamiento mediante React Router DOM.

```
src/
├── App.jsx                     # Raíz: AuthProvider + AppRouter
├── main.jsx                    # Entry point (mount en #root)
│
├── context/
│   └── AuthContext.jsx         # Estado global de autenticación
│
├── hooks/
│   └── useAuth.js              # Hook para consumir AuthContext
│
├── routes/
│   ├── AppRouter.jsx           # Definición de rutas + guards
│   └── ProtectedRoute.jsx      # HOC de ruta protegida
│
├── services/
│   ├── api.js                  # Cliente Axios + interceptores
│   ├── authService.js          # Login, registro, perfil, etc.
│   ├── mascotaService.js       # CRUD de mascotas
│   └── solicitudService.js     # Gestión de solicitudes
│
├── modules/
│   ├── auth/
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── ForgotPasswordPage.jsx
│   │       └── ResetPasswordPage.jsx
│   │
│   ├── pets/
│   │   └── pages/
│   │       ├── CatalogPage.jsx     # Listado público con filtros
│   │       └── PetDetailPage.jsx   # Detalle de mascota + solicitar adopción
│   │
│   ├── admin/
│   │   └── pages/
│   │       └── AdminDashboardPage.jsx  # Panel de administración
│   │
│   └── user/
│       └── pages/
│           ├── UserDashboardPage.jsx   # Panel del usuario
│           └── UserProfile.jsx         # Editar perfil
│
└── shared/
    ├── layouts/
    │   └── MainLayout.jsx      # Layout base con navbar
    ├── components/             # Componentes reutilizables
    └── utils/                  # Utilidades compartidas
```

### Rutas del Frontend

| Ruta | Acceso | Página |
|---|---|---|
| `/` o `/pets` | Público | Catálogo de mascotas |
| `/pets/:id` | Público | Detalle de mascota |
| `/login` | Público (redirige si autenticado) | Login |
| `/register` | Público (redirige si autenticado) | Registro |
| `/forgot-password` | Público | Recuperar contraseña |
| `/reset-password` | Público | Restablecer contraseña |
| `/user/dashboard` | Autenticado | Dashboard del usuario |
| `/user/profile` | Autenticado | Perfil del usuario |
| `/admin/dashboard` | Solo ADMINISTRADOR | Panel de administración |
| `*` | Público | 404 Not Found |

### Manejo de Autenticación en el Cliente
- El token Bearer se almacena en `localStorage` bajo la clave `token`
- El interceptor de Axios lo adjunta automáticamente a cada petición
- Si la API responde `401`, se limpia `localStorage` y redirige a `/login`
- Si la API responde `429` (rate limit), se loguea una advertencia en consola

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- PHP ^8.2
- Composer
- Node.js y npm
- SQLite (incluido en PHP por defecto)

---

### Backend (`pawmatch-api`)

**1. Instalar dependencias:**
```bash
cd pawmatch-api
composer install
```

**2. Configurar variables de entorno:**
```bash
cp .env.example .env
php artisan key:generate
```

**3. Editar `.env` con tus valores:**
```env
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# La base de datos SQLite se crea automáticamente en database/database.sqlite

# Configuración de correo (requerida para notificaciones)
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=tu@email.com
MAIL_PASSWORD=tu_password
MAIL_FROM_ADDRESS=noreply@pawmatch.com
MAIL_FROM_NAME="PawMatch"
```

**4. Ejecutar migraciones y seeders:**
```bash
php artisan migrate
php artisan db:seed     # Datos de prueba: usuarios, mascotas y solicitudes
```

**5. Crear enlace de almacenamiento para imágenes:**
```bash
php artisan storage:link
```

**6. Iniciar el servidor:**
```bash
php artisan serve
# API disponible en: http://localhost:8000/api
```

> **Alternativa rápida:** Puedes usar el script de setup incluido en `composer.json`:
> ```bash
> composer setup
> ```

---

### Frontend (`pawmatch-frontend`)

**1. Instalar dependencias:**
```bash
cd pawmatch-frontend
npm install
```

**2. Configurar variables de entorno:**
```bash
cp .env.example .env
```

**3. Editar `.env`:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=PawMatch
```

**4. Iniciar el servidor de desarrollo:**
```bash
npm run dev
# Aplicación disponible en: http://localhost:5173
```

---

## 🧪 Pruebas

### Backend
```bash
cd pawmatch-api

# Limpiar caché de configuración y ejecutar todas las pruebas
php artisan test

# O con el alias de composer
composer test
```

Las pruebas usan **Pest PHP** y están ubicadas en `pawmatch-api/tests/`.

### Frontend
```bash
cd pawmatch-frontend

# Verificar calidad de código con ESLint
npm run lint
```

---

## 👥 Usuarios de Prueba (Seeders)

Al ejecutar `php artisan db:seed` se crean los siguientes usuarios de prueba:

| Rol | Email | Contraseña |
|---|---|---|
| `ADMINISTRADOR` | admin@pawmatch.com | password |
| `USUARIO` | usuario@pawmatch.com | password |

> Ver `database/seeders/UserSeeder.php` para más detalles.

---

## 📦 Scripts Disponibles

### Backend
| Comando | Descripción |
|---|---|
| `composer setup` | Instalación completa (install + key + migrate + build) |
| `composer dev` | Servidor + queue + logs + vite en paralelo |
| `composer test` | Limpiar caché y ejecutar pruebas |

### Frontend
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilar para producción |
| `npm run preview` | Previsualizar build de producción |
| `npm run lint` | Analizar código con ESLint |

---

## 📖 Documentación de la API

La API incluye documentación automática generada por **Dedoc Scramble**. Una vez que el servidor esté corriendo, accede a:

```
http://localhost:8000/docs/api
```

---

## 🤝 Contribución

1. Crea un fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nombre-feature`
3. Realiza tus cambios y haz commit: `git commit -m 'feat: descripción del cambio'`
4. Sube los cambios: `git push origin feature/nombre-feature`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
