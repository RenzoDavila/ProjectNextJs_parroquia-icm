-- ============================================
-- ESQUEMA DEFINITIVO - PARROQUIA ICM
-- PostgreSQL - Sistema Completo
-- Fecha: 13 de diciembre de 2025
-- VERSIÓN DEFINITIVA - 27 TABLAS
-- ============================================

-- NOTA: Este archivo unifica schema.sql y las correcciones necesarias
-- para que todo funcione con las APIs existentes.

-- ============================================
-- LIMPIEZA PREVIA (Si ejecutas de nuevo)
-- ============================================

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS mass_available_times CASCADE;
DROP TABLE IF EXISTS mass_types CASCADE;
DROP TABLE IF EXISTS mass_pricing CASCADE;
DROP TABLE IF EXISTS mass_reservations CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS gallery_submissions CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_albums CASCADE;
DROP TABLE IF EXISTS gallery_photos CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;
DROP TABLE IF EXISTS sacrament_notes CASCADE;
DROP TABLE IF EXISTS sacrament_requirements CASCADE;
DROP TABLE IF EXISTS sacrament_sections CASCADE;
DROP TABLE IF EXISTS pastoral_schedules CASCADE;
DROP TABLE IF EXISTS office_hours CASCADE;
DROP TABLE IF EXISTS confession_schedules CASCADE;
DROP TABLE IF EXISTS mass_schedules CASCADE;
DROP TABLE IF EXISTS parish_groups CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS interest_pages CASCADE;
DROP TABLE IF EXISTS home_services CASCADE;
DROP TABLE IF EXISTS home_banners CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS social_media CASCADE;
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ============================================
-- 1. CONFIGURACIÓN GENERAL DEL SITIO
-- ============================================
-- Usado por: Todas las páginas (Header, Footer, etc.)
-- API: GET /api/settings

CREATE TABLE site_config (
  id SERIAL PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  config_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER
);

-- Datos iniciales
INSERT INTO site_config (config_key, config_value, config_type, description) VALUES
('site_name', 'Parroquia Inmaculado Corazón de María', 'text', 'Nombre del sitio'),
('site_tagline', 'Miraflores, Arequipa', 'text', 'Subtítulo del sitio'),
('site_email', 'icmpamiraflores@gmail.com', 'text', 'Email principal'),
('site_phone', '(054) 253-280', 'text', 'Teléfono principal'),
('site_whatsapp', '932408576', 'text', 'WhatsApp'),
('site_address', 'Calle Tacna 540 - A, Miraflores - Arequipa - Perú', 'text', 'Dirección'),
('site_city', 'Miraflores, Arequipa - Perú', 'text', 'Ciudad y país'),
('facebook_page_id', 'parroquia.miraflores.arequipa', 'text', 'ID de página de Facebook'),
('youtube_channel', 'UCKgN4YP_cOQd4LQYV1Ey5nw', 'text', 'Canal de YouTube');

-- ============================================
-- 2. REDES SOCIALES
-- ============================================
-- Usado por: Header, Footer, Contacto
-- API: GET /api/social-media

CREATE TABLE social_media (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  platform_name VARCHAR(100),
  url TEXT NOT NULL,
  icon_name VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  show_in_header BOOLEAN DEFAULT TRUE,
  show_in_footer BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO social_media (platform, platform_name, url, icon_name, display_order) VALUES
('facebook', 'Facebook', 'https://www.facebook.com/parroquia.miraflores.arequipa/', 'facebook', 1),
('youtube', 'YouTube', 'https://www.youtube.com/channel/UCKgN4YP_cOQd4LQYV1Ey5nw', 'youtube', 2),
('instagram', 'Instagram', 'https://www.instagram.com/picmaqp2023', 'instagram', 3);

-- ============================================
-- 3. BANNERS / SLIDER DE INICIO
-- ============================================
-- Usado por: Home Page (Hero Slider)
-- API: GET /api/banners, Admin: /api/admin/banners

CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_text VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO banners (title, subtitle, description, image_url, link_url, link_text, display_order) VALUES
('Bienvenidos', 'Parroquia Inmaculado Corazón de María', 'Una comunidad de fe, esperanza y amor en el corazón de Arequipa', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=2000', '/nosotros', 'Conócenos', 1),
('Reserva tu Misa', 'Intenciones de Misa', 'Solicita una intención de misa para tus seres queridos de manera fácil y rápida', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=2000', '/reservar', 'Reservar Ahora', 2),
('Pastoral Juvenil', 'Jóvenes por Cristo', 'Únete a nuestra comunidad de jóvenes comprometidos con la fe y el servicio', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000', 'https://www.instagram.com/pastoralicm', 'Síguenos', 3);

-- ============================================
-- 4. SERVICIOS (Cards en página principal)
-- ============================================
-- Usado por: Home Page (Sección "Nuestros Servicios")
-- API: GET /api/home-services

CREATE TABLE home_services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  link_url VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO home_services (title, description, icon, link_url, display_order) VALUES
('Horarios y Servicios', 'Consulta los horarios de misas, confesiones y servicios parroquiales.', 'clock', '/horarios', 1),
('Reservaciones', 'Reserva misas, bautizos, matrimonios y otros sacramentos.', 'calendar', '/reservar', 2),
('Servicios Pastorales', 'Conoce nuestros grupos pastorales y actividades comunitarias.', 'heart', '/servicios', 3);

-- ============================================
-- 5. PÁGINAS DE INTERÉS
-- ============================================
-- Usado por: Home Page (Sección inferior)
-- API: GET /api/interest-pages

CREATE TABLE interest_pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO interest_pages (title, image_url, link_url, display_order) VALUES
('Catequesis', 'https://images.unsplash.com/photo-1544776193-52f10d0f912c?w=400', '#', 1),
('Cáritas', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400', '#', 2),
('Jóvenes', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', '#', 3),
('Familias', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', '#', 4);

-- ============================================
-- 6. EQUIPO PASTORAL / MIEMBROS
-- ============================================
-- Usado por: Nosotros (Sección "Directorio")
-- API: GET /api/team, Admin: /api/admin/team

CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  bio TEXT,
  image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO team_members (name, role, image_url, display_order) VALUES
('Peter Oromuno Theocracy', 'Párroco', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', 1),
('Franco Kasico', 'Vicario Parroquial', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300', 2),
('Anicio López Campos', 'Vicario Parroquial', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', 3),
('Víctor Hugo Sotomayor Lecaros', 'Administrador', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300', 4),
('Silvia Collado Cárdenas', 'Secretaria', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300', 5),
('Eliana Málaga Portocarrero', 'Sacristana', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300', 6);

-- ============================================
-- 7. GRUPOS PARROQUIALES
-- ============================================
-- Usado por: Nosotros (Sección "Grupos Parroquiales")
-- API: GET /api/parish-groups

CREATE TABLE parish_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_day VARCHAR(100),
  meeting_time VARCHAR(100),
  category VARCHAR(50) DEFAULT 'parroquiales',
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO parish_groups (name, description, meeting_day, meeting_time, category, display_order) VALUES
('Grupo Misionero Juventud Claretiana', 'Grupo de Jóvenes que siguen las huellas de San Antonio María Claret, recibiendo una formación y crecimiento personal para la evangelización a través de la Misión.', 'Domingos', '3:00 p.m.', 'parroquiales', 1),
('Renovación Carismática', 'Movimiento de Renovación de la vida Cristiana desde la acción del Espíritu Santo para la evangelización y la sanación interior.', 'Jueves', '6:00 p.m.', 'parroquiales', 2),
('Legión de María', 'Organización apostólica de laicos en la Iglesia Católica. Se ora, se revisa la actividad apostólica, y se estudian temas formativos para hacer más eficaz el apostolado.', 'Lunes', '4:00 p.m.', 'parroquiales', 3),
('Guardia de Honor del Sagrado Corazón de Jesús', 'Devoción santificadora y sublime al Sagrado Corazón de Jesús, según la espiritualidad de santa Margarita María de Alacoque.', 'Primeros Viernes', '5:45 p.m.', 'parroquiales', 4),
('Apostolado del Señor de la Divina Misericordia', 'Su Apostolado principal es mostrar a todas las almas al amor infinito de Dios, enseñándoles a confiar en la Divina Misericordia de su Hijo.', 'Viernes', '5:45 p.m.', 'parroquiales', 5),
('Marías y Juanes de los Sagrarios Calvarios (UNER)', 'Unión Eucarística Reparadora, llamada a la santidad, junto a María y al Discípulo para dar y buscar a Jesús eucaristía.', 'Jueves', '5:45 p.m.', 'parroquiales', 6);

-- ============================================
-- 8. HORARIOS DE MISA (INFORMATIVOS)
-- ============================================
-- Usado por: Horarios (información adicional si se necesita)
-- API: GET /api/mass-schedules (opcional)

CREATE TABLE mass_schedules (
  id SERIAL PRIMARY KEY,
  location_name VARCHAR(255) NOT NULL,
  location_address TEXT,
  day_type VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  mass_type VARCHAR(100) DEFAULT 'Misa',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parroquia - Entre semana
INSERT INTO mass_schedules (location_name, day_type, time, mass_type, display_order) VALUES
('Parroquia', 'weekdays', '6:00 a.m.', 'Misa', 1),
('Parroquia', 'weekdays', '7:00 a.m.', 'Misa', 2),
('Parroquia', 'weekdays', '9:00 a.m.', 'Misa', 3),
('Parroquia', 'weekdays', '7:00 p.m.', 'Misa', 4),
('Parroquia', 'saturdays', '6:00 a.m.', 'Misa', 1),
('Parroquia', 'saturdays', '7:00 a.m.', 'Misa', 2),
('Parroquia', 'saturdays', '9:00 a.m.', 'Misa', 3),
('Parroquia', 'saturdays', '6:00 p.m.', 'Misa Dominical', 4),
('Parroquia', 'sundays', '7:00 a.m.', 'Misa', 1),
('Parroquia', 'sundays', '9:00 a.m.', 'Misa', 2),
('Parroquia', 'sundays', '11:00 a.m.', 'Misa', 3),
('Parroquia', 'sundays', '6:00 p.m.', 'Misa', 4);

-- Capilla
INSERT INTO mass_schedules (location_name, location_address, day_type, time, mass_type, display_order) VALUES
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'weekdays', '7:00 a.m.', 'Misa', 1),
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'weekdays', '6:30 p.m.', 'Misa', 2),
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'saturdays', '7:00 a.m.', 'Misa', 1),
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'saturdays', '6:30 p.m.', 'Misa Dominical', 2),
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'sundays', '7:00 a.m.', 'Misa', 1),
('Capilla Sta. Rosa de Lima', 'Jr. José Sabogal 1111 - Umacollo', 'sundays', '6:30 p.m.', 'Misa', 2);

-- ============================================
-- 9. HORARIOS DE CONFESIÓN
-- ============================================
-- Usado por: Horarios Page
-- API: GET /api/confession-schedules

CREATE TABLE confession_schedules (
  id SERIAL PRIMARY KEY,
  day VARCHAR(100) NOT NULL,
  time VARCHAR(255) NOT NULL,
  location VARCHAR(255) DEFAULT 'Parroquia',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO confession_schedules (day, time, display_order) VALUES
('Lunes a Viernes', '6:30 a.m. - 7:00 a.m. y 8:30 a.m. - 9:00 a.m.', 1),
('Lunes a Viernes', '6:30 p.m. - 7:00 p.m.', 2),
('Sábados', '5:00 p.m. - 6:00 p.m.', 3);

-- ============================================
-- 10. HORARIOS DE OFICINA/SECRETARÍA
-- ============================================
-- Usado por: Horarios, Nosotros, Contacto
-- API: GET /api/office-hours

CREATE TABLE office_hours (
  id SERIAL PRIMARY KEY,
  day_type VARCHAR(50) NOT NULL,
  period VARCHAR(50),
  start_time VARCHAR(50) NOT NULL,
  end_time VARCHAR(50) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO office_hours (day_type, period, start_time, end_time, display_order) VALUES
('weekdays', 'morning', '8:00 a.m.', '12:30 p.m.', 1),
('weekdays', 'afternoon', '4:00 p.m.', '6:30 p.m.', 2),
('saturdays', 'morning', '9:00 a.m.', '12:00 m.', 3);

-- ============================================
-- 11. HORARIOS DE ATENCIÓN PASTORAL
-- ============================================
-- Usado por: Horarios Page
-- API: GET /api/pastoral-schedules

CREATE TABLE pastoral_schedules (
  id SERIAL PRIMARY KEY,
  priest_role VARCHAR(100) NOT NULL,
  priest_name VARCHAR(255),
  day VARCHAR(100) NOT NULL,
  time VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO pastoral_schedules (priest_role, day, time, display_order) VALUES
('Párroco', 'Lunes a Viernes', '10:00 a.m. - 12:00 m.', 1),
('Párroco', 'Lunes a Viernes', '5:00 p.m. - 6:00 p.m.', 2),
('Vicario Parroquial', 'Lunes a Viernes', '9:00 a.m. - 11:00 a.m.', 3),
('Vicario Parroquial', 'Lunes a Viernes', '4:00 p.m. - 5:30 p.m.', 4);

-- ============================================
-- 12. SECCIONES DE SACRAMENTOS
-- ============================================
-- Usado por: Servicios Page
-- API: GET /api/sacraments

CREATE TABLE sacrament_sections (
  id SERIAL PRIMARY KEY,
  sacrament_name VARCHAR(100) NOT NULL,
  section_title VARCHAR(255) NOT NULL,
  section_subtitle VARCHAR(255),
  icon VARCHAR(50),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 13. REQUISITOS DE SACRAMENTOS
-- ============================================

CREATE TABLE sacrament_requirements (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sacrament_sections(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 14. NOTAS DE SACRAMENTOS
-- ============================================

CREATE TABLE sacrament_notes (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sacrament_sections(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 15. GALERÍA - ÁLBUMES
-- ============================================
-- Usado por: Galería Page
-- API: GET /api/gallery/albums

CREATE TABLE gallery_albums (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER,
  day INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  date_event DATE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO gallery_albums (year, title, cover_image_url, display_order) VALUES
(2024, 'Semana Santa 2024', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600', 1),
(2024, 'Fiesta Patronal', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=600', 2),
(2023, 'Navidad 2023', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=600', 1),
(2023, 'Corpus Christi 2023', 'https://images.unsplash.com/photo-1548690595-90c53c39a7e4?q=80&w=600', 2),
(2023, 'Primera Comunión', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=600', 3);

-- ============================================
-- 16. GALERÍA - IMÁGENES
-- ============================================
-- Usado por: Galería Page
-- API: GET /api/gallery/images

CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  album_id INTEGER REFERENCES gallery_albums(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 17. GALERÍA - ENVÍOS PÚBLICOS
-- ============================================
-- Usado por: Admin Gallery (aprobar envíos)

CREATE TABLE gallery_submissions (
  id SERIAL PRIMARY KEY,
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255),
  event_date DATE NOT NULL,
  event_year INTEGER NOT NULL,
  event_month INTEGER,
  event_day INTEGER,
  event_title VARCHAR(255),
  description TEXT,
  images_data JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER
);

-- ============================================
-- 18. USUARIOS ADMINISTRADORES
-- ============================================
-- Usado por: Sistema de login, auditoría
-- API: NextAuth

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario admin por defecto (password: Admin123!)
INSERT INTO admin_users (email, password_hash, name, role) VALUES
('admin@parroquiaicm.com', '$2b$10$rKqF8xMJKhGkPXvZ5J5YOuX8QGY7VzJ9xKVJGwJxGKJGxKVJGwJxG', 'Administrador', 'admin');

-- ============================================
-- 19. TIPOS DE MISAS (SISTEMA DE RESERVAS)
-- ============================================
-- NOTA: Esta tabla es la que usan las APIs actuales
-- Usado por: Reservar Page, Admin Mass Pricing
-- API: GET /api/mass-types, PUT /api/admin/mass-pricing/:id

CREATE TABLE mass_types (
  id SERIAL PRIMARY KEY,
  tipo_misa VARCHAR(50) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO mass_types (tipo_misa, nombre, descripcion, precio, display_order) VALUES
('simple', 'Misa Simple', 'Intención de misa para un día específico. Incluye celebración eucarística y mención del nombre del difunto o intención.', 30.00, 1),
('novenario', 'Novenario (9 días)', 'Novena de misas durante 9 días consecutivos. Incluye celebración diaria y acompañamiento espiritual a la familia.', 250.00, 2),
('cabo_ano', 'Cabo de Año', 'Misa de aniversario al cumplirse un año del fallecimiento. Incluye ceremonia especial y recordatorio del ser querido.', 50.00, 3);

-- ============================================
-- 20. HORARIOS DISPONIBLES PARA RESERVAS
-- ============================================
-- Usado por: Reservar Page, Horarios Page, Admin Mass Times
-- API: GET /api/schedules, GET /api/reservations/available-times

CREATE TABLE mass_available_times (
  id SERIAL PRIMARY KEY,
  day_type VARCHAR(50) NOT NULL,
  time VARCHAR(50) NOT NULL,
  location VARCHAR(100) DEFAULT 'Parroquia',
  max_reservations INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO mass_available_times (day_type, time, location, display_order) VALUES
('weekdays', '07:00', 'Iglesia Principal', 1),
('weekdays', '18:30', 'Iglesia Principal', 2),
('saturdays', '07:00', 'Iglesia Principal', 1),
('saturdays', '18:30', 'Iglesia Principal', 2),
('saturdays', '19:00', 'Capilla del Santísimo', 3),
('sundays', '07:00', 'Iglesia Principal', 1),
('sundays', '09:00', 'Iglesia Principal', 2),
('sundays', '11:00', 'Iglesia Principal', 3),
('sundays', '18:30', 'Iglesia Principal', 4),
('sundays', '19:00', 'Capilla del Santísimo', 5);

-- ============================================
-- 21. MÉTODOS DE PAGO
-- ============================================
-- Usado por: Reservar Page
-- API: GET /api/payment-methods

CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payment_methods (code, name, description, display_order) VALUES
('cash', 'Efectivo', 'Pago en efectivo en la secretaría parroquial. Horario de atención: Lunes a Viernes de 9:00 AM a 11:00 AM y de 4:00 PM a 5:30 PM.', 1),
('yape', 'Yape', 'Transferencia mediante Yape al número: 964 486 230 (Parroquia ICM). Enviar captura de pantalla por WhatsApp.', 2),
('plin', 'Plin', 'Transferencia mediante Plin al número: 964 486 230 (Parroquia ICM). Enviar captura de pantalla por WhatsApp.', 3),
('transfer', 'Transferencia Bancaria', 'Banco: BCP | Cuenta Corriente: 215-98690368-0-35 | CCI: 00221519869036803522 | Titular: Parroquia Inmaculado Corazón de María', 4);

-- ============================================
-- 22. RESERVAS DE MISAS
-- ============================================
-- Usado por: Reservar Page (POST), Admin Reservations
-- API: POST /api/reservations, GET /api/reservations

CREATE TABLE mass_reservations (
  id SERIAL PRIMARY KEY,
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(50) NOT NULL,
  location VARCHAR(100) DEFAULT 'Parroquia',
  
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  dni VARCHAR(8) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  tipo_misa VARCHAR(50) NOT NULL,
  intencion TEXT NOT NULL,
  difuntos TEXT,
  observaciones TEXT,
  
  precio DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  comprobante_url TEXT,
  pago_verificado BOOLEAN DEFAULT FALSE,
  
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  confirmation_code VARCHAR(50) UNIQUE,
  
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  confirmed_by INTEGER REFERENCES admin_users(id)
);

-- ============================================
-- 23. MENSAJES DE CONTACTO
-- ============================================
-- Usado por: Contacto Page
-- API: POST /api/contact

CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  replied_at TIMESTAMP
);

-- ============================================
-- 24. LOGS DE ACTIVIDAD (AUDITORÍA)
-- ============================================
-- Usado por: Admin (internamente)

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================

-- Reservas
CREATE INDEX idx_mass_reservations_date ON mass_reservations(reservation_date);
CREATE INDEX idx_mass_reservations_datetime ON mass_reservations(reservation_date, reservation_time);
CREATE INDEX idx_mass_reservations_status ON mass_reservations(status);
CREATE INDEX idx_mass_reservations_email ON mass_reservations(email);
CREATE INDEX idx_mass_reservations_dni ON mass_reservations(dni);

-- Contenido
CREATE INDEX idx_mass_schedules_location ON mass_schedules(location_name);
CREATE INDEX idx_mass_schedules_day_type ON mass_schedules(day_type);
CREATE INDEX idx_gallery_albums_year ON gallery_albums(year);
CREATE INDEX idx_gallery_images_album ON gallery_images(album_id);
CREATE INDEX idx_gallery_submissions_status ON gallery_submissions(status);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Sistema de reservas
CREATE INDEX idx_mass_types_tipo ON mass_types(tipo_misa);
CREATE INDEX idx_mass_available_times_day ON mass_available_times(day_type);
CREATE INDEX idx_payment_methods_code ON payment_methods(code);

-- ============================================
-- RESUMEN FINAL
-- ============================================

SELECT '✅ Schema DEFINITIVO creado exitosamente!' as mensaje;
SELECT '📊 Total de tablas creadas: 24' as detalle;
SELECT 
  '📋 Tablas creadas:' as lista,
  '1. site_config, 2. social_media, 3. banners, 4. home_services,' as t1,
  '5. interest_pages, 6. team_members, 7. parish_groups, 8. mass_schedules,' as t2,
  '9. confession_schedules, 10. office_hours, 11. pastoral_schedules,' as t3,
  '12. sacrament_sections, 13. sacrament_requirements, 14. sacrament_notes,' as t4,
  '15. gallery_albums, 16. gallery_images, 17. gallery_submissions,' as t5,
  '18. admin_users, 19. mass_types, 20. mass_available_times,' as t6,
  '21. payment_methods, 22. mass_reservations, 23. contact_messages,' as t7,
  '24. activity_logs' as t8;
