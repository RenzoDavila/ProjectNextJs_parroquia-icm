# 📊 Base de Datos PostgreSQL - Parroquia ICM

## 🎯 Estructura Completa del CMS

Esta base de datos permite gestionar **todo el contenido** de la web de la parroquia desde el dashboard admin.

---

## 📋 Tablas Principales

### **1. Configuración General**
- `site_config` - Configuración del sitio (nombre, email, teléfono, dirección, etc.)

### **2. Redes Sociales**
- `social_media` - Enlaces a redes sociales (Facebook, YouTube, Instagram, etc.)

### **3. Página de Inicio**
- `home_banners` - Slider/Banner de la página principal
- `home_services` - Cards de servicios (Horarios, Reservaciones, etc.)
- `interest_pages` - Páginas de interés (Catequesis, Cáritas, Jóvenes, etc.)

### **4. Equipo y Grupos**
- `team_members` - Miembros del equipo (Párroco, Vicarios, Secretaria, etc.)
- `parish_groups` - Grupos parroquiales (Juventud Claretiana, Renovación, etc.)

### **5. Horarios**
- `mass_schedules` - Horarios de misas (Parroquia y Capilla)
- `confession_schedules` - Horarios de confesión
- `office_hours` - Horarios de secretaría
- `pastoral_schedules` - Horarios de atención pastoral

### **6. Sacramentos (Sistema Dinámico)**
- `sacrament_sections` - Secciones de sacramentos (Bautismo de niños, adultos, Matrimonio, etc.)
- `sacrament_requirements` - Requisitos de cada sacramento
- `sacrament_notes` - Notas importantes de cada sacramento

### **7. Galería**
- `gallery_albums` - Álbumes de fotos organizados por fecha (año/mes/día)
- `gallery_images` - Imágenes de cada álbum
- `gallery_submissions` - Envíos públicos pendientes de aprobación

### **8. Contacto**
- `contact_messages` - Mensajes del formulario de contacto

### **9. Administración**
- `admin_users` - Usuarios del dashboard
- `activity_logs` - Registro de actividades (auditoría)

---

## 🚀 Instalación en cPanel

### **Paso 1: Crear la Base de Datos**

1. Entra a tu panel de **cPanel**
2. Ve a **"Bases de datos PostgreSQL"**
3. Crea la base de datos:
   - Nombre: `corazon2_parroquia_icm` (o el que prefieras)
   - Click en "Crear base de datos"

### **Paso 2: Crear Usuario**

1. En la misma página, crea un usuario:
   - Usuario: `corazon2_admin`
   - Contraseña: **Genera una segura** (guárdala)
   - Click en "Crear usuario"

### **Paso 3: Dar Permisos**

1. En "Añadir usuario a base de datos":
   - Selecciona el usuario `corazon2_admin`
   - Selecciona la base `corazon2_parroquia_icm`
   - Marca **TODOS LOS PRIVILEGIOS**
   - Click en "Añadir"

### **Paso 4: Ejecutar el Schema**

1. En cPanel, ve a **"phpPgAdmin"** (administrador de PostgreSQL)
2. Selecciona tu base de datos `corazon2_parroquia_icm`
3. Ve a la pestaña **"SQL"**
4. Copia **todo** el contenido del archivo `schema.sql`
5. Pégalo en el editor SQL
6. Click en **"Ejecutar"**

✅ ¡Listo! La base de datos está creada con datos de ejemplo.

---

## 🔑 Credenciales de Conexión

Anota estos datos para el archivo `.env.local`:

```env
# PostgreSQL de cPanel
DB_HOST=localhost (o la IP que te dé cPanel)
DB_PORT=5432
DB_USER=corazon2_admin
DB_PASSWORD=tu_contraseña_aquí
DB_NAME=corazon2_parroquia_icm
DB_SSL=false

# Cloudinary (para imágenes)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_UPLOAD_PRESET=tu_preset

# NextAuth (autenticación del dashboard)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_string_aleatorio_seguro
```

---

## 👤 Usuario Admin por Defecto

**⚠️ IMPORTANTE: Cambiar después de la primera configuración**

```
Email: admin@corazondemariaarequipa.com
Password: Admin123!
```

---

## 📝 Funcionalidades del Dashboard

### **Módulos Editables:**

1. ✅ **Banner de Inicio** - Subir imágenes del slider principal
2. ✅ **Servicios** - Editar los 3 cards de la home
3. ✅ **Páginas de Interés** - Catequesis, Cáritas, etc.
4. ✅ **Redes Sociales** - URLs y configuración de embeds
5. ✅ **Equipo** - Fotos y datos del equipo parroquial
6. ✅ **Grupos Parroquiales** - Información de grupos y horarios
7. ✅ **Horarios de Misa** - Gestionar horarios por ubicación y día
8. ✅ **Horarios de Confesión** - Editar horarios de confesión
9. ✅ **Horarios de Oficina** - Horarios de secretaría
10. ✅ **Atención Pastoral** - Horarios de sacerdotes
11. ✅ **Sacramentos** - Sistema dinámico para agregar/editar sacramentos
12. ✅ **Galería de Fotos** - Subir fotos organizadas por fecha
13. ✅ **Aprobación de Fotos** - Revisar envíos públicos
14. ✅ **Mensajes de Contacto** - Ver y responder mensajes
15. ✅ **Configuración General** - Email, teléfono, dirección, etc.

---

## 🖼️ Sistema de Galería Avanzado

### **Características:**

1. **Upload por fecha** - Año, mes y día opcionales
2. **Álbumes automáticos** - Se organizan por fecha
3. **Envíos públicos** - Los usuarios pueden enviar fotos
4. **Sistema de aprobación** - El admin revisa antes de publicar
5. **Mover/Fusionar** - Reorganizar fotos entre álbumes
6. **Cloudinary** - CDN global para carga rápida

### **Flujo de trabajo:**

```
Usuario envía fotos → gallery_submissions (pendiente)
                            ↓
Admin revisa en dashboard → Aprobar/Editar/Rechazar
                            ↓
Si aprueba → Se crea album en gallery_albums
            → Se guardan en gallery_images
            → Se ven en /galeria
```

---

## 🎨 Sistema de Sacramentos Dinámico

Permite crear **nuevas secciones** de sacramentos con:
- Título y subtítulo
- Icono
- Descripción
- Lista de requisitos (ilimitados)
- Lista de notas (ilimitadas)

**Ejemplo:** Puedes agregar "Confirmación", "Primera Comunión", etc.

---

## 🔒 Niveles de Usuario

- **admin** - Acceso total, puede crear usuarios
- **editor** - Puede editar contenido, no puede crear usuarios
- **viewer** - Solo puede ver el dashboard (lectura)

---

## 📊 Logs de Actividad

Todas las acciones se registran en `activity_logs`:
- Quién hizo el cambio
- Qué cambió
- Cuándo lo hizo
- IP del usuario

---

## 🎯 Próximos Pasos

1. ✅ Ejecutar este schema en cPanel
2. ⏭️ Configurar conexión en Next.js
3. ⏭️ Instalar Cloudinary
4. ⏭️ Crear API Routes
5. ⏭️ Crear componentes del Dashboard
6. ⏭️ Migrar páginas públicas a datos dinámicos

---

## 📞 Soporte

Si tienes dudas al ejecutar el schema o conectar la base de datos, avísame y te ayudo paso a paso.
