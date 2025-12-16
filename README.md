# Parroquia Inmaculado Corazón de María - Página Web y Panel Administrativo

Este es el repositorio oficial de la página web de la Parroquia Inmaculado Corazón de María (Arequipa). Incluye tanto la vista pública para feligreses como un completo panel de administración para la gestión de contenido y reservas.

## 🚀 Tecnologías

*   **Framework:** Next.js 16 (App Router)
*   **Lenguaje:** TypeScript
*   **Estilos:** TailwindCSS
*   **Base de Datos:** PostgreSQL
*   **Autenticación:** JWT Custom (Seguro)

## 📂 Documentación Técnica

Para mantener este README limpio, la documentación técnica detallada se encuentra en archivos específicos:

*   **[ARQUITECTURA_COMPLETA.md](./ARQUITECTURA_COMPLETA.md)**: Visión global del proyecto, estructura de base de datos, lista de APIs y estado de implementación. **(LECTURA OBLIGATORIA)**
*   **[DOCS_AUTENTICACION.md](./DOCS_AUTENTICACION.md)**: Todo sobre el sistema de login, usuarios administradores y seguridad.
*   **[GUIA_DESPLEGAR_ACTUALIZAR_CPANEL.md](./GUIA_DESPLEGAR_ACTUALIZAR_CPANEL.md)**: Instructivo paso a paso para desplegar en producción (cPanel).

## 🛠️ Instalación y Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repo>
    cd parroquia-icm-nextjs
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.development.local` con las siguientes variables (puedes copiar de `.env.local` si tienes acceso):
    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=tu_usuario
    DB_PASSWORD=tu_password
    DB_NAME=parroquia_dev
    JWT_SECRET=tu_clave_secreta_local
    ```

4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Visita [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciales por Defecto (Desarrollo)
*   **Email:** `admin@parroquiaicm.com`
*   **Contraseña:** `Admin123!`

---
*Desarrollado para los Misioneros Claretianos - Miraflores, Arequipa.*
