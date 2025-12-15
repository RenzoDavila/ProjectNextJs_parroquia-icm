// ============================================
// TIPOS DE BASE DE DATOS
// ============================================

export interface MassType {
  id: number;
  tipo_misa: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: number;
  method_type: string;
  method_name: string;
  description: string | null;
  banco: string | null;
  cuenta: string | null;
  cci: string | null;
  titular: string | null;
  instructions: string | null;
  is_active: boolean;
  display_order: number;
}

export interface AvailableTime {
  id: number;
  day_type: 'weekdays' | 'saturdays' | 'sundays';
  time: string;
  location: string;
  max_reservations: number;
  is_active: boolean;
  display_order: number;
}

export interface MassReservation {
  id: number;
  reservation_date: Date;
  reservation_time: string;
  location: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  tipo_misa: string;
  intencion: string;
  difuntos: string | null;
  observaciones: string | null;
  precio: number;
  metodo_pago: string;
  comprobante_url: string | null;
  comprobante_cloudinary_id: string | null;
  pago_verificado: boolean;
  status: 'pending' | 'confirmed' | 'payment_pending' | 'cancelled' | 'completed';
  admin_notes: string | null;
  confirmation_code: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  updated_at: Date;
  confirmed_at: Date | null;
  confirmed_by: number | null;
}

// ============================================
// TIPOS PARA API RESPONSES
// ============================================

export interface MassTypeResponse {
  value: string;
  label: string;
  price: number;
  description: string;
}

export interface PaymentMethodResponse {
  type: string;
  name: string;
  description: string;
  banco?: string;
  cuenta?: string;
  cci?: string;
  titular?: string;
  instructions?: string;
}

export interface AvailableTimeResponse {
  time: string;
  isAvailable: boolean;
  reservationsCount: number;
}

export interface CreateReservationRequest {
  date: string;
  time: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  tipoMisa: string;
  intencion: string;
  difuntos?: string;
  observaciones?: string;
  metodoPago: string;
  comprobanteUrl?: string;
  comprobanteCloudinaryId?: string;
}

export interface CreateReservationResponse {
  success: boolean;
  message: string;
  reservationId?: number;
  confirmationCode?: string;
  error?: string;
}

// ============================================
// TIPOS PARA CONFIGURACIÓN
// ============================================

export interface SiteConfig {
  id: number;
  config_key: string;
  config_value: string | null;
  config_type: string;
  description: string | null;
  updated_at: Date;
  updated_by: number | null;
}

export interface SocialMedia {
  id: number;
  platform: string;
  platform_name: string | null;
  url: string;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  created_at: Date;
}

export interface HomeBanner {
  id: number;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  image_cloudinary_id: string | null;
  link_url: string | null;
  link_text: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface HomeService {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  image_cloudinary_id: string | null;
  email: string | null;
  phone: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface ParishGroup {
  id: number;
  name: string;
  description: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  category: string;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface GalleryAlbum {
  id: number;
  year: number;
  month: number | null;
  day: number | null;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  cover_cloudinary_id: string | null;
  date_event: Date | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface GalleryImage {
  id: number;
  album_id: number;
  title: string | null;
  description: string | null;
  image_url: string;
  image_cloudinary_id: string;
  thumbnail_url: string | null;
  display_order: number;
  is_approved: boolean;
  uploaded_by: string | null;
  created_at: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  read_at: Date | null;
  replied_at: Date | null;
}

// ============================================
// TIPOS ADICIONALES PARA PÁGINAS
// ============================================

export interface MassSchedule {
  id: number;
  location_name: string;
  location_address: string | null;
  day_type: 'weekdays' | 'saturdays' | 'sundays';
  time: string;
  mass_type: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface ConfessionSchedule {
  id: number;
  day: string;
  time: string;
  location: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface OfficeHours {
  id: number;
  day_type: string;
  period: string | null;
  start_time: string;
  end_time: string;
  display_order: number;
  is_active: boolean;
}

export interface PastoralSchedule {
  id: number;
  priest_role: string;
  priest_name: string | null;
  day: string;
  time: string;
  display_order: number;
  is_active: boolean;
}

export interface InterestPage {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

// ============================================
// TIPOS DE UTILIDAD
// ============================================

export type DayType = 'weekdays' | 'saturdays' | 'sundays';
export type ReservationStatus = 'pending' | 'confirmed' | 'payment_pending' | 'cancelled' | 'completed';
export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';

// ============================================
// TIPOS PARA API REQUESTS/RESPONSES
// ============================================

export interface CreateReservationRequest {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  tipoMisa: string;
  intencion: string;
  difuntos?: string;
  observaciones?: string;
  metodoPago: string;
  comprobanteUrl?: string;
  comprobanteCloudinaryId?: string;
}

export interface CreateReservationResponse {
  success: boolean;
  message: string;
  reservationId?: number;
  confirmationCode?: string;
  error?: string;
}
