export interface NavItem {
  name: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface MassSchedule {
  day: string;
  morning: string[];
  afternoon: string[];
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

export interface ParishGroup {
  id: string;
  name: string;
  description: string;
  meetingDay: string;
  meetingTime: string;
  image: string;
  category: 'parroquiales' | 'eclesiales' | 'congregacionales';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  image: string;
}

export interface GalleryEvent {
  id: string;
  date: string;
  description: string;
  images: string[];
  year: string;
}

export interface Reservation {
  id?: string;
  date: string;
  time: string;
  name: string;
  address?: string;
  phone: string;
  massType: string;
  intention: string;
  offeredBy: string;
  musicOption: 'none' | 'guitar' | 'organ' | 'organ-duo';
  amount: number;
  status: 'pending' | 'paid' | 'confirmed';
  createdAt: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
