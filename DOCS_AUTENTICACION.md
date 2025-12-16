# 🔐 Documentación del Sistema de Autenticación

Este documento consolida toda la información técnica sobre la implementación del login y seguridad del Panel Administrativo.

## 🚀 Resumen del Sistema

El sistema utiliza autenticación basada en **JWT (JSON Web Tokens)** almacenados en **cookies HTTP-only**.

*   **Ruta de Login:** `/admin/login`
*   **Cookie:** `auth-token` (HTTP-only, Lax, Secure en Prod)
*   **Middleware:** Protege todas las rutas `/admin/*` verificando la existencia de la cookie.
*   **API Auth:** `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`.

---

## ⚙️ Configuración Requerida

Para que el sistema funcione, es **OBLIGATORIO** tener la variable `JWT_SECRET` configurada.

### Entornos
El proyecto maneja dos entornos de base de datos definidos en los archivos `.env`:

1.  **Desarrollo (`.env.development.local`)**:
    *   Usa base de datos LOCAL (`parroquia_dev` en localhost).
    *   Debe contener: `JWT_SECRET=tu-clave-secreta`

2.  **Producción (`.env.local`)**:
    *   Usa base de datos REMOTA (`corazon2_parroquia`).
    *   Debe contener: `JWT_SECRET=tu-clave-secreta`

---

## 👤 Gestión de Usuarios

### Usuario Administrador por Defecto
*   **Email:** `admin@parroquiaicm.com`
*   **Contraseña:** `Admin123!`

### Crear Nuevo Usuario (SQL)
Para crear un usuario manualmente en la base de datos (local o producción), ejecuta:

```sql
INSERT INTO admin_users (email, password_hash, name, role, is_active) 
VALUES (
  'nuevo@email.com',
  -- Hash para 'Admin123!':
  '$2b$10$kcpyodNN2ZDEDFgf6/o7COo.JJNhl1uaI2SBU33nSOfYqY5TnZ1za',
  'Nombre Usuario',
  'admin',
  true
);
```

### Actualizar Contraseña (SQL)
Si necesitas resetear una contraseña a `Admin123!`:

```sql
UPDATE admin_users 
SET password_hash = '$2b$10$kcpyodNN2ZDEDFgf6/o7COo.JJNhl1uaI2SBU33nSOfYqY5TnZ1za'
WHERE email = 'email@usuario.com';
```

---

## 🛠️ Detalles Técnicos

### 1. Middleware (`src/middleware.ts`)
*   Se ejecuta en el Edge Runtime.
*   Verifica que la cookie `auth-token` exista antes de permitir el acceso a `/admin/*`.
*   Si no existe, redirige a `/admin/login`.

### 2. Login (`src/app/admin/login/page.tsx`)
*   Envía credenciales a la API.
*   Al recibir éxito, usa `window.location.href = '/admin'` para forzar una recarga completa y asegurar que la cookie se envíe correctamente desde el primer momento.

### 3. Layout Admin (`src/app/admin/layout.tsx`)
*   Hace una verificación secundaria en el cliente llamando a `/api/auth/me`.
*   Muestra el dashboard solo si la verificación es exitosa.

---

## ⚠️ Solución de Problemas Comunes

### "Me redirige al login constantemente"
1.  Verifica que `JWT_SECRET` esté idéntico en `.env.development.local` (si estás en dev) y `.env.local`.
2.  Asegúrate de que estás actualizando la base de datos correcta (Local vs Producción). Recuerda que `npm run dev` usa la local.

### "Credenciales inválidas"
1.  Es probable que el usuario no exista en la base de datos que estás usando.
2.  Verifica la tabla: `SELECT * FROM admin_users;`
