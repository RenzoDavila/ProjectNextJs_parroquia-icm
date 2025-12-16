# 📋 ARQUITECTURA COMPLETA - Parroquia ICM

## Documento Maestro de la Aplicación
**Última actualización:** 16 de diciembre de 2025
**Versión:** 1.1

---

## 🏗️ ESTRUCTURA GENERAL

La aplicación se divide en **2 grandes módulos**:

| Módulo | URL Base | Descripción |
|--------|----------|-------------|
| **Página Web Pública** | `/` | Sitio visible para visitantes |
| **Dashboard Administrativo** | `/admin` | Panel de gestión protegido (Autenticación JWT) |

### 📚 Documentación Relacionada
*   [🔐 Sistema de Autenticación](./DOCS_AUTENTICACION.md) - Detalles de login y seguridad.
*   [🚀 Guía de Despliegue](./GUIA_DESPLEGAR_ACTUALIZAR_CPANEL.md) - Pasos para subir a producción (cPanel).

---

# 🌐 PÁGINA WEB PÚBLICA

## Páginas y sus Dependencias

### 1. **Página de Inicio** (`/`)
**Archivo:** `src/app/page.tsx`

| Sección | Origen de Datos | Tabla BD | Status API |
|---------|-----------------|----------|------------|
| Hero Slider | API `/api/banners` | `banners` | ✅ Funcional |
| Bienvenida | API `/api/home-content` | `page_sections` | ✅ Funcional |
| Donaciones | API `/api/donation-info` | `donation_info` | ✅ Funcional |
| Nuestros Servicios | API `/api/home-services` | `home_services` | ✅ Funcional |
| Páginas de Interés | API `/api/interest-pages` | `interest_pages` | ✅ Funcional |

### 2. **Nosotros** (`/nosotros`)
*   **Info Parroquia:** `src/lib/constants.ts` (Pendiente migrar a BD)
*   **Equipo:** Hardcoded (Pendiente API `/api/team`)
*   **Grupos:** Hardcoded (Pendiente API `/api/parish-groups`)

### 3. **Horarios** (`/horarios`)
*   **Misas:** API `/api/schedules` ✅
*   **Confesión/Secretaría:** Hardcoded (Pendiente)

### 4. **Reservar Misa** (`/reservar`)
*   **Tipos:** API `/api/mass-types` ✅
*   **Horarios:** API `/api/reservations/available-times` ✅
*   **Crear Reserva:** POST `/api/reservations` ✅

### 5. **Otras Páginas**
*   **Galería:** Hardcoded (Pendiente integración real)
*   **Servicios (Sacramentos):** Hardcoded
*   **Contacto:** Formulario funcional (envía email/db)

---

# 🔧 DASHBOARD ADMINISTRATIVO

**Acceso:** Requiere Login (`admin@parroquiaicm.com`).

## Módulos del Admin

### 1. **Gestión de Reservas** (`/admin/reservations`)
*   **Listar:** ✅ Funcional (Filtros, Búsqueda, Paginación).
*   **Detalle:** ⏳ Pendiente implementación completa.
*   **Acciones:** Confirmar/Cancelar reservas.

### 2. **Horarios de Misa** (`/admin/mass-times`)
*   **CRUD Completo:** ✅ Crear, Editar, Eliminar, Activar/Desactivar horarios base.

### 3. **Precios** (`/admin/mass-pricing`)
*   **CRUD Completo:** ✅ Editar precios y descripciones de tipos de misa.

### 4. **Contenido Web** (CMS)
*   **Donaciones:** ✅ `/admin/donation-info` - Gestión completa de cuentas bancarias y mensajes.
*   **Banners:** ✅ `/admin/banners` - Gestión del slider principal con subida de imágenes.
*   **Servicios Home:** ✅ `/admin/home-content` - Gestión de cards de servicios.

---

# 📊 BASE DE DATOS Y ESQUEMA

## Tablas Críticas (Sistema Reservas)
1.  `mass_types`: Tipos de misa (Salud, Difuntos, etc).
2.  `mass_available_times`: Horarios base semanales.
3.  `mass_reservations`: Reservas registradas.
4.  `admin_users`: Usuarios con acceso al panel.

## Tablas de Contenido (CMS)
1.  `donation_info`: Información bancaria y mensajes de donación.
    *   *Campos:* title, subtitle, bank_data, purpose_title, purpose_description, images.
2.  `banners`: Imagenes del slider home.
3.  `home_services`: Iconos y textos de servicios en home.
4.  `interest_pages`: Enlaces de interés.
5.  `page_sections`: Contenido estático editable (Bienvenidos, Pastoral, etc).

---

# 📈 ESTADO DEL PROYECTO

## ✅ Completado
*   **Autenticación:** Sistema JWT seguro implementado.
*   **Base de Datos:** Esquema postgreSQL desplegado.
*   **Reservas Public:** Flujo completo de reserva de misas.
*   **CMS Básico:** Banners, Donaciones, Servicios Home.
*   **Admin Base:** Precios, Horarios.

## ⏳ Pendiente (Próximos Pasos)
1.  **Galería Dinámica:** Migrar galería hardcoded a BD.
2.  **Equipo Pastoral:** Crear API y CRUD para miembros del equipo.
3.  **Confirmación de Reservas:** Finalizar lógica de aprobación de reservas en admin.
4.  **Dashboard Stats:** Implementar gráficas reales en `/admin` (home).

---

# 🔌 APIs Principales

## Públicas
*   GET `/api/banners`
*   GET `/api/donation-info`
*   GET `/api/home-services`
*   GET `/api/mass-types`
*   GET `/api/schedules`
*   GET `/api/reservations/available-times`
*   POST `/api/reservations`

## Privadas (Admin)
*   GET/POST/PUT `/api/admin/banners`
*   GET/POST/PUT `/api/admin/donation-info`
*   GET/PUT `/api/admin/mass-pricing`
*   GET/POST/PUT/DELETE `/api/admin/mass-times`
*   GET `/api/admin/reservations`
*   GET `/api/auth/me`
