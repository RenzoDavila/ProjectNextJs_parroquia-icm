# 📋 ARQUITECTURA COMPLETA - Parroquia ICM

## Documento Maestro de la Aplicación
**Fecha:** 13 de diciembre de 2025
**Versión:** 1.0

---

## 🏗️ ESTRUCTURA GENERAL

La aplicación se divide en **2 grandes módulos**:

| Módulo | URL Base | Descripción |
|--------|----------|-------------|
| **Página Web Pública** | `/` | Sitio visible para visitantes |
| **Dashboard Administrativo** | `/admin` | Panel de gestión para administradores |

---

# 🌐 PÁGINA WEB PÚBLICA

## Páginas y sus Dependencias

### 1. **Página de Inicio** (`/`)
**Archivo:** `src/app/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Hero Slider | `constants.ts` → HERO_SLIDES | `banners` | GET /api/banners | ✅ Funcional |
| Bienvenida | `constants.ts` → SITE_CONFIG | `site_config` | GET /api/settings | ✅ Funcional |
| Nuestros Servicios | Hardcoded | `home_services` | GET /api/home-services | ✅ Funcional |
| Redes Sociales (FB/YT) | Hardcoded URLs | `social_media` | GET /api/social-media | ✅ Funcional |
| Pastoral Juvenil | Hardcoded | `interest_pages` | GET /api/interest-pages | ✅ Funcional |
| Páginas de Interés | Hardcoded | `interest_pages` | GET /api/interest-pages | ✅ Funcional |

---

### 2. **Nosotros** (`/nosotros`)
**Archivo:** `src/app/nosotros/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Info Parroquia | `constants.ts` → SITE_CONFIG | `site_config` | GET /api/settings | ✅ Funcional |
| Horarios Secretaría | Hardcoded | `office_hours` | GET /api/office-hours | ✅ Funcional |
| Dirección/Contacto | `constants.ts` | `site_config` | GET /api/settings | ✅ Funcional |
| Directorio (Equipo) | Hardcoded (6 personas) | `team_members` | GET /api/team | ✅ Funcional |
| Grupos Parroquiales | Hardcoded (6 grupos) | `parish_groups` | GET /api/parish-groups | ✅ Funcional |

---

### 3. **Horarios** (`/horarios`)
**Archivo:** `src/app/horarios/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Horarios de Misas | API `/api/schedules` | `mass_available_times` | GET /api/schedules | ✅ Funcional |
| Horarios Informativos | Hardcoded | `mass_schedules` | GET /api/mass-schedules | ✅ Funcional |
| Horarios Confesión | Hardcoded | `confession_schedules` | GET /api/confession-schedules | ✅ Funcional |
| Horarios Secretaría | Hardcoded | `office_hours` | GET /api/office-hours | ✅ Funcional |
| Atención Párroco | Hardcoded | `pastoral_schedules` | GET /api/pastoral-schedules | ✅ Funcional |
| Atención Vicario | Hardcoded | `pastoral_schedules` | GET /api/pastoral-schedules | ✅ Funcional |

---

### 4. **Servicios** (`/servicios`)
**Archivo:** `src/app/servicios/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Bautismo Niños | Hardcoded | `sacrament_sections` + `sacrament_requirements` + `sacrament_notes` | GET /api/sacraments | ⏳ Pendiente |
| Bautismo Mayores | Hardcoded | `sacrament_sections` + `sacrament_requirements` | GET /api/sacraments | ⏳ Pendiente |
| Bautismo Emergencia | Hardcoded | `sacrament_sections` + `sacrament_requirements` | GET /api/sacraments | ⏳ Pendiente |
| Matrimonio Ordinario | Hardcoded | `sacrament_sections` + `sacrament_requirements` | GET /api/sacraments | ⏳ Pendiente |
| Matrimonio Regularización | Hardcoded | `sacrament_sections` + `sacrament_requirements` | GET /api/sacraments | ⏳ Pendiente |

---

### 5. **Galería** (`/galeria`)
**Archivo:** `src/app/galeria/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Filtro por Año | Hardcoded (2022-2024) | `gallery_albums` | GET /api/gallery/albums | ✅ Funcional |
| Eventos/Álbumes | Hardcoded (6 eventos) | `gallery_albums` | GET /api/gallery/albums | ✅ Funcional |
| Fotos por Evento | Hardcoded | `gallery_images` | GET /api/gallery/images | ✅ Funcional |
| Lightbox Viewer | N/A | N/A | N/A | ✅ Funcional |

---

### 6. **Reservar Misa** (`/reservar`)
**Archivo:** `src/app/reservar/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Tipos de Misa | API `/api/mass-types` | `mass_types` | GET /api/mass-types | ✅ Funcional |
| Horarios Disponibles | API `/api/reservations/available-times` | `mass_available_times` + `mass_reservations` | GET /api/reservations/available-times | ✅ Funcional |
| Métodos de Pago | API `/api/payment-methods` | `payment_methods` | GET /api/payment-methods | ✅ Funcional |
| Crear Reserva | API `/api/reservations` | `mass_reservations` | POST /api/reservations | ✅ Funcional |
| Subir Comprobante | Incluido en reserva | N/A (Cloudinary opcional) | Incluido en POST | ✅ Funcional |

---

### 7. **Contacto** (`/contacto`)
**Archivo:** `src/app/contacto/page.tsx`

| Sección | Origen de Datos | Tabla BD | API Necesaria | Estado |
|---------|-----------------|----------|---------------|--------|
| Info Contacto | `constants.ts` → SITE_CONFIG | `site_config` | GET /api/contact | ✅ Funcional |
| Horarios Atención | Hardcoded | `office_hours` | GET /api/office-hours | ✅ Funcional |
| Redes Sociales | Hardcoded | `social_media` | GET /api/social-media | ✅ Funcional |
| Formulario Contacto | Simulado | `contact_messages` | POST /api/contact | ✅ Funcional |
| Mapa | Google Maps embed | `site_config` (coordenadas) | N/A | ✅ Funcional |

---

# 🔧 DASHBOARD ADMINISTRATIVO

## Páginas y sus Dependencias

### 1. **Dashboard Principal** (`/admin`)
**Archivo:** `src/app/admin/page.tsx`

| Widget | Origen de Datos | Tabla BD | API Necesaria | Estado |
|--------|-----------------|----------|---------------|--------|
| Total Reservas | Simulado | `mass_reservations` | GET /api/admin/stats | ⏳ Pendiente |
| Reservas Pendientes | Simulado | `mass_reservations` | GET /api/admin/stats | ⏳ Pendiente |
| Reservas Confirmadas | Simulado | `mass_reservations` | GET /api/admin/stats | ⏳ Pendiente |
| Ingresos Totales | Simulado | `mass_reservations` | GET /api/admin/stats | ⏳ Pendiente |
| Últimas Reservas | Simulado | `mass_reservations` | GET /api/reservations?limit=5 | ⏳ Pendiente |

---

### 2. **Gestión de Reservas** (`/admin/reservations`)
**Archivo:** `src/app/admin/reservations/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Reservas | `mass_reservations` | GET /api/reservations | ✅ Funcional |
| Filtrar por Estado | `mass_reservations` | GET /api/reservations?status=X | ✅ Funcional |
| Buscar Reservas | `mass_reservations` | GET /api/reservations?search=X | ✅ Funcional |
| Ver Detalle | `mass_reservations` | GET /api/reservations/:id | ⏳ Pendiente |
| Confirmar Reserva | `mass_reservations` | PUT /api/admin/reservations/:id | ⏳ Pendiente |
| Cancelar Reserva | `mass_reservations` | PUT /api/admin/reservations/:id | ⏳ Pendiente |
| Verificar Pago | `mass_reservations` | PUT /api/admin/reservations/:id | ⏳ Pendiente |

---

### 3. **Horarios de Misa** (`/admin/mass-times`)
**Archivo:** `src/app/admin/mass-times/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Horarios | `mass_available_times` | GET /api/admin/mass-times | ✅ Funcional |
| Crear Horario | `mass_available_times` | POST /api/admin/mass-times | ✅ Funcional |
| Editar Horario | `mass_available_times` | PUT /api/admin/mass-times/:id | ✅ Funcional |
| Eliminar Horario | `mass_available_times` | DELETE /api/admin/mass-times/:id | ✅ Funcional |
| Activar/Desactivar | `mass_available_times` | PUT /api/admin/mass-times/:id | ✅ Funcional |

---

### 4. **Precios de Misas** (`/admin/mass-pricing`)
**Archivo:** `src/app/admin/mass-pricing/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Precios | `mass_types` | GET /api/mass-types | ✅ Funcional |
| Editar Precio | `mass_types` | PUT /api/admin/mass-pricing/:id | ✅ Funcional |
| Editar Descripción | `mass_types` | PUT /api/admin/mass-pricing/:id | ✅ Funcional |

---

### 5. **Equipo Pastoral** (`/admin/team`)
**Archivo:** `src/app/admin/team/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Miembros | `team_members` | GET /api/admin/team | ⏳ Pendiente |
| Crear Miembro | `team_members` | POST /api/admin/team | ⏳ Pendiente |
| Editar Miembro | `team_members` | PUT /api/admin/team/:id | ⏳ Pendiente |
| Eliminar Miembro | `team_members` | DELETE /api/admin/team/:id | ⏳ Pendiente |
| Subir Foto | N/A (Cloudinary) | POST /api/upload | ⏳ Pendiente |

---

### 6. **Banners** (`/admin/banners`)
**Archivo:** `src/app/admin/banners/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Banners | `banners` | GET /api/admin/banners | ⏳ Pendiente |
| Crear Banner | `banners` | POST /api/admin/banners | ⏳ Pendiente |
| Editar Banner | `banners` | PUT /api/admin/banners/:id | ⏳ Pendiente |
| Eliminar Banner | `banners` | DELETE /api/admin/banners/:id | ⏳ Pendiente |
| Subir Imagen | N/A (Cloudinary) | POST /api/upload | ⏳ Pendiente |
| Reordenar | `banners` | PUT /api/admin/banners/reorder | ⏳ Pendiente |

---

### 7. **Galería** (`/admin/gallery`)
**Archivo:** `src/app/admin/gallery/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Listar Álbumes | `gallery_albums` | GET /api/admin/gallery/albums | ⏳ Pendiente |
| Crear Álbum | `gallery_albums` | POST /api/admin/gallery/albums | ⏳ Pendiente |
| Listar Fotos | `gallery_images` | GET /api/admin/gallery/images | ⏳ Pendiente |
| Subir Fotos | `gallery_images` | POST /api/admin/gallery/images | ⏳ Pendiente |
| Eliminar Foto | `gallery_images` | DELETE /api/admin/gallery/images/:id | ⏳ Pendiente |
| Aprobar Envíos | `gallery_submissions` | PUT /api/admin/gallery/submissions/:id | ⏳ Pendiente |

---

### 8. **Páginas** (`/admin/pages`)
**Archivo:** `src/app/admin/pages/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Gestión de Contenido | Varias | Varias | ⏳ Pendiente |

---

### 9. **Configuración** (`/admin/settings`)
**Archivo:** `src/app/admin/settings/page.tsx`

| Funcionalidad | Tabla BD | API Necesaria | Estado |
|---------------|----------|---------------|--------|
| Info General | `site_config` / `site_settings` | GET/PUT /api/admin/settings | ⏳ Pendiente |
| Redes Sociales | `social_media` | GET/PUT /api/admin/social-media | ⏳ Pendiente |
| Métodos de Pago | `payment_methods` | GET/PUT /api/admin/payment-methods | ⏳ Pendiente |
| Horarios Secretaría | `office_hours` | GET/PUT /api/admin/office-hours | ⏳ Pendiente |
| Configuración Reservas | `site_settings` | GET/PUT /api/admin/settings | ⏳ Pendiente |

---

# 📊 BASE DE DATOS - TABLAS REQUERIDAS

## Tablas del Sistema de Reservas (CRÍTICAS)

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 1 | `mass_types` | Tipos de misa con precios | Reservar, Admin Pricing | 🔴 CRÍTICA |
| 2 | `mass_available_times` | Horarios disponibles para reservas | Reservar, Horarios, Admin Times | 🔴 CRÍTICA |
| 3 | `payment_methods` | Métodos de pago | Reservar, Admin Settings | 🔴 CRÍTICA |
| 4 | `mass_reservations` | Reservas realizadas | Reservar, Admin Reservations | 🔴 CRÍTICA |
| 5 | `admin_users` | Usuarios administradores | Admin Login, Activity Logs | 🔴 CRÍTICA |

## Tablas del CMS (Contenido)

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 6 | `site_config` | Configuración general antigua | Todas las páginas | 🟡 ALTA |
| 7 | `site_settings` | Configuración general moderna | Todas las páginas | 🟡 ALTA |
| 8 | `social_media` | Redes sociales | Header, Footer, Contacto | 🟡 ALTA |
| 9 | `banners` / `home_banners` | Sliders del inicio | Home | 🟡 ALTA |
| 10 | `team_members` | Equipo pastoral | Nosotros, Admin Team | 🟡 ALTA |
| 11 | `parish_groups` | Grupos parroquiales | Nosotros | 🟡 ALTA |

## Tablas de Horarios (Informativos)

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 12 | `mass_schedules` | Horarios de misas (informativos) | Horarios (backup) | 🟢 MEDIA |
| 13 | `confession_schedules` | Horarios de confesión | Horarios | 🟢 MEDIA |
| 14 | `office_hours` | Horarios de secretaría | Horarios, Nosotros, Contacto | 🟢 MEDIA |
| 15 | `pastoral_schedules` | Horarios atención pastoral | Horarios | 🟢 MEDIA |

## Tablas de Sacramentos

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 16 | `sacrament_sections` | Secciones de sacramentos | Servicios | 🟢 MEDIA |
| 17 | `sacrament_requirements` | Requisitos por sacramento | Servicios | 🟢 MEDIA |
| 18 | `sacrament_notes` | Notas por sacramento | Servicios | 🟢 MEDIA |

## Tablas de Galería

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 19 | `gallery_albums` | Álbumes/Eventos | Galería | 🟢 MEDIA |
| 20 | `gallery_images` | Fotos por álbum | Galería | 🟢 MEDIA |
| 21 | `gallery_submissions` | Envíos públicos pendientes | Admin Gallery | 🔵 BAJA |
| 22 | `gallery_categories` | Categorías de galería | Galería (alternativo) | 🔵 BAJA |
| 23 | `gallery_photos` | Fotos por categoría | Galería (alternativo) | 🔵 BAJA |

## Tablas de Servicios/Utilidades

| # | Tabla | Descripción | Usado Por | Prioridad |
|---|-------|-------------|-----------|-----------|
| 24 | `home_services` | Cards de servicios en Home | Home | 🔵 BAJA |
| 25 | `interest_pages` | Páginas de interés | Home | 🔵 BAJA |
| 26 | `contact_messages` | Mensajes de contacto | Contacto, Admin | 🟢 MEDIA |
| 27 | `activity_logs` | Logs de auditoría | Admin (internamente) | 🔵 BAJA |

---

# 🔌 APIs - RESUMEN DE ENDPOINTS

## APIs Públicas (Existentes ✅)

```
GET  /api/mass-types              → Tipos de misa con precios
GET  /api/payment-methods         → Métodos de pago
GET  /api/schedules               → Horarios de misa para reservas
GET  /api/reservations/available-times?date=YYYY-MM-DD → Horarios disponibles
POST /api/reservations            → Crear reserva
GET  /api/reservations/verify?code=XXX → Verificar código de reserva
```

## APIs Admin (Existentes ✅)

```
GET    /api/admin/mass-times      → Listar horarios
POST   /api/admin/mass-times      → Crear horario
PUT    /api/admin/mass-times/:id  → Editar horario
DELETE /api/admin/mass-times/:id  → Eliminar horario
PUT    /api/admin/mass-pricing/:id → Editar precio de misa
```

## APIs Públicas (Pendientes ⏳)

```
GET  /api/banners                 → Banners del slider
GET  /api/team                    → Equipo pastoral
GET  /api/parish-groups           → Grupos parroquiales
GET  /api/settings                → Configuración del sitio
GET  /api/social-media            → Redes sociales
GET  /api/office-hours            → Horarios de secretaría
GET  /api/confession-schedules    → Horarios de confesión
GET  /api/pastoral-schedules      → Horarios atención pastoral
GET  /api/sacraments              → Información de sacramentos
GET  /api/gallery/albums          → Álbumes de galería
GET  /api/gallery/images/:albumId → Fotos de un álbum
POST /api/contact                 → Enviar mensaje de contacto
```

## APIs Admin (Pendientes ⏳)

```
GET    /api/admin/stats           → Estadísticas del dashboard
GET    /api/admin/reservations    → Listar reservas
PUT    /api/admin/reservations/:id → Actualizar estado reserva
GET    /api/admin/team            → Listar equipo
POST   /api/admin/team            → Crear miembro
PUT    /api/admin/team/:id        → Editar miembro
DELETE /api/admin/team/:id        → Eliminar miembro
GET    /api/admin/banners         → Listar banners
POST   /api/admin/banners         → Crear banner
PUT    /api/admin/banners/:id     → Editar banner
DELETE /api/admin/banners/:id     → Eliminar banner
GET    /api/admin/gallery/albums  → Listar álbumes
POST   /api/admin/gallery/albums  → Crear álbum
POST   /api/admin/gallery/images  → Subir imagen
DELETE /api/admin/gallery/images/:id → Eliminar imagen
GET    /api/admin/settings        → Obtener configuración
PUT    /api/admin/settings        → Actualizar configuración
POST   /api/upload                → Subir archivo (Cloudinary)
```

---

# 📈 ESTADO ACTUAL Y PROGRESO

## Resumen por Módulo

| Módulo | Total Funcionalidades | Completadas | En Progreso | Pendientes |
|--------|----------------------|-------------|-------------|------------|
| Sistema de Reservas | 12 | 10 | 0 | 2 |
| Página de Inicio | 6 | 1 | 0 | 5 |
| Nosotros | 5 | 0 | 0 | 5 |
| Horarios | 5 | 1 | 0 | 4 |
| Servicios | 5 | 0 | 0 | 5 |
| Galería | 4 | 1 | 0 | 3 |
| Contacto | 5 | 1 | 0 | 4 |
| Admin Dashboard | 5 | 0 | 0 | 5 |
| Admin Reservations | 7 | 3 | 0 | 4 |
| Admin Mass Times | 5 | 5 | 0 | 0 |
| Admin Mass Pricing | 3 | 3 | 0 | 0 |
| Admin Team | 5 | 0 | 0 | 5 |
| Admin Banners | 6 | 0 | 0 | 6 |
| Admin Gallery | 6 | 0 | 0 | 6 |
| Admin Settings | 5 | 0 | 0 | 5 |

## Totales

- **Total funcionalidades:** 84
- **Completadas:** 25 (30%)
- **Pendientes:** 59 (70%)

---

# 🎯 PRÓXIMOS PASOS RECOMENDADOS

## Fase 1: Base de Datos (AHORA)
1. ✅ Definir schema completo con TODAS las tablas
2. ⏳ Ejecutar schema en PostgreSQL
3. ⏳ Insertar datos iniciales

## Fase 2: APIs Públicas Básicas
1. GET /api/team (equipo pastoral)
2. GET /api/banners (sliders)
3. GET /api/settings (configuración)
4. GET /api/parish-groups (grupos)

## Fase 3: Integración Frontend Público
1. Conectar Home con APIs
2. Conectar Nosotros con APIs
3. Conectar Contacto con API

## Fase 4: Admin Completo
1. Implementar CRUD de Team
2. Implementar CRUD de Banners
3. Implementar CRUD de Gallery
4. Implementar Settings

## Fase 5: Autenticación
1. Implementar NextAuth
2. Proteger rutas /admin/*
3. Roles y permisos

---

# 📝 NOTAS IMPORTANTES

1. **Datos Hardcoded**: La mayoría de páginas públicas tienen datos hardcoded en el código. Estos deben migrarse a consumir las APIs.

2. **Dos sistemas de configuración**: Existen `site_config` (schema original) y `site_settings` (datos-iniciales.sql). Se recomienda unificar en `site_settings`.

3. **Dos sistemas de galería**: Existen `gallery_albums`/`gallery_images` y `gallery_categories`/`gallery_photos`. Elegir uno y eliminar el otro.

4. **Constants.ts**: El archivo `src/lib/constants.ts` tiene mucha configuración que debería venir de la BD.

5. **Cloudinary**: Aún no está configurado para subida de imágenes. Las URLs actuales son de Unsplash (temporales).
